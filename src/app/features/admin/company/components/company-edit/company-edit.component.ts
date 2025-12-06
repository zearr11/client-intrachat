import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
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
import { CompanyService } from '../../services/company.service';
import { Modal } from 'bootstrap';
import { Patterns } from '../../../../../shared/utils/patterns.class';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of, tap } from 'rxjs';
import {
  CompanyRequest2,
  CompanyResponse,
} from '../../interfaces/company.interface';

@Component({
  selector: 'company-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './company-edit.component.html',
})
export class CompanyEditComponent {
  /* Servicios necesarios */
  private formGroup = inject(FormBuilder);
  private toastService = inject(ToastMessageService);
  private companyService = inject(CompanyService);

  /* Signals */
  dataCompany = input.required<CompanyResponse>();
  updateCompany = signal<CompanyRequest2 | null>(null);
  updateTable = output<boolean>();

  /* Carga de data */
  setData = effect(() => {
    if (!this.dataCompany()) return;

    this.myForm.reset({
      razonSocial: this.dataCompany().razonSocial,
      nombreComercial: this.dataCompany().nombreComercial,
      ruc: this.dataCompany().ruc,
      correo: this.dataCompany().correo,
      telefono: this.dataCompany().telefono,
    });
  });

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
    razonSocial: ['', [Validators.required, Validators.maxLength(150)]],
    nombreComercial: ['', [Validators.required, Validators.maxLength(150)]],
    ruc: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
    correo: [
      '',
      [
        Validators.required,
        Validators.pattern(Patterns.emailPattern),
        Validators.maxLength(100),
      ],
    ],
    telefono: ['', [Validators.pattern(/^[0-9]{7,9}$/)]],
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

    this.updateCompany.set(this.myForm.value);
  }

  httpUpdateCompany = rxResource({
    request: () => ({
      id: this.dataCompany()?.id,
      dataUpdated: this.updateCompany(),
    }),
    loader: ({ request }) => {
      if (!request.id || !request.dataUpdated) return of({ error: true });

      return this.companyService
        .updateCompany(request.id, request.dataUpdated)
        .pipe(
          tap((msg) => {
            this.updateCompany.set(null);
            this.toastService.show(msg, 'text-bg-success');
            // this.updateTable.emit(true);
            // this.close();
          }),
          map((msg) => ({ error: false, message: msg })),
          catchError((err) => {
            const message = err.message ?? 'Error.';
            this.toastService.show(message, 'text-bg-danger');
            return of({ error: true, message });
          })
        );
    },
  });
}
