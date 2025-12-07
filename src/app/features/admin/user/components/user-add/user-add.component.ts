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
import { EnumsList } from '../../../../../shared/utils/enums-list.class';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Patterns } from '../../../../../shared/utils/patterns.class';
import { Modal } from 'bootstrap';
import { UserRequest } from '../../../../../core/interfaces/user.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of, tap } from 'rxjs';
import { UserService } from '../../../../../core/services/user.service';
import { Position } from '../../../../../core/enums/position-user.enum';
import { Role } from '../../../../../core/enums/role-user.enum';
import { RemoveUnderScorePipe } from '../../../../../shared/pipes/remove-underscore.pipe';

@Component({
  selector: 'user-add',
  imports: [ReactiveFormsModule, TitleCasePipe, RemoveUnderScorePipe],
  templateUrl: './user-add.component.html',
})
export class UserAddComponent {
  /* Servicios necesarios */
  private formGroup = inject(FormBuilder);
  private toastService = inject(ToastMessageService);
  private userService = inject(UserService);

  /* Signals */
  dataNewUser = signal<UserRequest | null>(null);
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

  /* Carga de selects */
  typesDoc = EnumsList.tipoDocs;
  genders = EnumsList.genders;
  roles = EnumsList.positions;

  /* Formulario reactivo */
  myForm: FormGroup = this.formGroup.group({
    nombres: ['', [Validators.required, Validators.maxLength(100)]],
    apellidos: ['', [Validators.required, Validators.maxLength(100)]],
    tipoDoc: ['', [Validators.required]],
    numeroDoc: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(13)],
    ],
    genero: ['', [Validators.required]],
    celular: [
      '',
      [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(Patterns.emailPattern),
        Validators.maxLength(100),
      ],
    ],
    rol: ['', [Validators.required]],
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

    const valuesForm = this.myForm.value;
    const role =
      valuesForm.rol == Position.ADMIN.toString() ? Role.ADMIN : Role.USUARIO;

    const newUser: UserRequest = {
      nombres: valuesForm.nombres,
      apellidos: valuesForm.apellidos,
      tipoDoc: valuesForm.tipoDoc,
      numeroDoc: valuesForm.numeroDoc,
      genero: valuesForm.genero,
      celular: valuesForm.celular,
      email: valuesForm.email,
      rol: role,
      cargo: valuesForm.rol,
    };

    this.dataNewUser.set(newUser);
  }

  /* ---------------------------- HTTP ------------------------------- */

  httpCreateNewUser = rxResource({
    request: () => ({ dataUser: this.dataNewUser() }),
    loader: ({ request }) => {
      if (!request.dataUser) return of({ error: true });

      return this.userService.registerNewUser(request.dataUser).pipe(
        tap((msg) => {
          this.dataNewUser.set(null);
          this.toastService.show(msg, 'text-bg-success');
          this.updateTable.emit(true);
          this.close();
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
