import {
  Component,
  ElementRef,
  inject,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastMessageService } from '../../../../../shared/services/toast-message.service';
import { HeadquartersService } from '../../services/headquarters.service';
import { HeadquartersRequest } from '../../interfaces/headquarters.interface';
import { Modal } from 'bootstrap';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseGeneric } from '../../../../../shared/interfaces/general-response.interface';

@Component({
  selector: 'headquarters-add',
  imports: [ReactiveFormsModule],
  templateUrl: './headquarters-add.component.html',
})
export class HeadquartersAddComponent {
  /* Servicios necesarios */
  private formGroup = inject(FormBuilder);
  private toastService = inject(ToastMessageService);
  private headquartersService = inject(HeadquartersService);

  /* Signals */
  dataNewHeadquarters = signal<HeadquartersRequest | null>(null);
  updateTable = output<boolean>();

  /* Referencia al modal actual */
  @ViewChild('modalElement') modalElement!: ElementRef;
  private modalInstance!: Modal;

  /* Asignacion como Elemento Modal */
  ngAfterViewInit() {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
  }

  /* Mostrar modal */
  show() {
    this.modalInstance.show();
  }

  /* Ocultar modal */
  close() {
    this.modalInstance.hide();
  }

  /* Formulario reactivo */
  myForm: FormGroup = this.formGroup.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    direccion: ['', [Validators.required, Validators.maxLength(200)]],
    numeroPostal: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(5)],
    ],
  });

  submitForm() {
    if (this.myForm.invalid) {
      console.log('INVALIDO:');

      Object.keys(this.myForm.controls).forEach((key) => {
        const control = this.myForm.get(key);
        console.log('Control:', key, 'Errores:', control?.errors);
      });

      this.toastService.show(
        'Datos inválidos, verifique la información ingresada e intente nuevamente.',
        'text-bg-danger'
      );
      console.log('--------------------------------');
      return;
    }

    const newData: HeadquartersRequest = {
      nombre: this.myForm.value.nombre,
      direccion: this.myForm.value.direccion,
      numeroPostal: this.myForm.value.numeroPostal,
    };

    this.dataNewHeadquarters.set(newData);
  }

  httpCreateNewHeadquarter = rxResource({
    request: () => ({ dataHeadquarters: this.dataNewHeadquarters() }),
    loader: ({ request }) => {
      if (!request.dataHeadquarters) return of({ error: true });

      return this.headquartersService
        .registerNewHeadquarters(request.dataHeadquarters)
        .pipe(
          tap({
            next: (msg) => {
              {
                this.dataNewHeadquarters.set(null);
                this.toastService.show(
                  'Sede registrada satisfactoriamente',
                  'text-bg-success'
                );
                this.updateTable.emit(true);
                this.close();
              }
            },
          }),
          map((msg) => ({ error: false, message: msg })),
          catchError((err: HttpErrorResponse) => {
            const message =
              (err.error as ResponseGeneric<null>).message ?? 'Error.';

            this.toastService.show(message, 'text-bg-danger');
            return of({ error: true, message });
          })
        );
    },
  });
}
