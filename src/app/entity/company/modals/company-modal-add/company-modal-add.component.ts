import {
  Component,
  ElementRef,
  inject,
  output,
  signal,
  ViewChild,
  viewChild,
} from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { ToastMessageService } from '../../../../shared/services/toast-message.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CompanyRequest } from '../../interfaces/company.interface';
import { Patterns } from '../../../user/utils/patterns.class';
import { TitleCasePipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of, tap } from 'rxjs';
import { Modal } from 'bootstrap';

@Component({
  selector: 'company-modal-add',
  imports: [ReactiveFormsModule],
  templateUrl: './company-modal-add.component.html',
})
export class CompanyModalAddComponent {
  /* Servicios necesarios */
  private formGroup = inject(FormBuilder);
  private toastService = inject(ToastMessageService);
  private companyService = inject(CompanyService);

  /* Signals */
  dataNewCompany = signal<CompanyRequest | null>(null);
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
    this.myForm.reset();
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

    this.dataNewCompany.set(this.myForm.value);
  }

  /* ---------------------------- HTTP ------------------------------- */

  httpCreateNewCompany = rxResource({
    request: () => ({ dataCompany: this.dataNewCompany() }),
    loader: ({ request }) => {
      if (!request.dataCompany) return of({ error: true });

      return this.companyService.registerNewCompany(request.dataCompany).pipe(
        tap({
          next: (msg) => {
            {
              this.dataNewCompany.set(null);
              this.toastService.show(msg, 'text-bg-success');
              this.updateTable.emit(true);
              this.close();
            }
          },
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
