import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Gender } from '../../enums/gender-user.enum';
import { TipoDoc } from '../../enums/tipo-doc-user.enum';
import { Patterns } from '../../utils/patterns.class';
import { EnumsList } from '../../utils/enums-list.class';
import { TitleCasePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ToastMessageService } from '../../../../shared/services/toast-message.service';

@Component({
  selector: 'user-add-layout',
  imports: [
    ReactiveFormsModule,
    TitleCasePipe
  ],
  templateUrl: './user-add-layout.component.html',
})
export class UserAddLayoutComponent {

  formGroup = inject(FormBuilder);
  toastService = inject(ToastMessageService);

  typesDoc = EnumsList.tipoDocs;
  genders = EnumsList.genders;
  roles = EnumsList.getRolesPermited(inject(UserService).dataUser()!.rol);

  closeModal = output<boolean>();
  dataForm = output<any>();

  myForm: FormGroup = this.formGroup.group({
    nombres: ['',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ],
    apellidos: ['', [
      Validators.required,
      Validators.maxLength(100)]
    ],
    tipoDoc: ['', [Validators.required]],
    numeroDoc: ['', [
      Validators.required, Validators.minLength(8), Validators.maxLength(13)
    ]],
    genero: ['', [Validators.required]],
    celular: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
    email: ['', [
      Validators.required, Validators.pattern(Patterns.emailPattern),
      Validators.maxLength(100)
    ]],
    rol: ['', [Validators.required]]
  })

  close() {
    this.closeModal.emit(true);
  }

  submitForm() {

    if (this.myForm.valid) {
      console.log('VALIDO:');
      // console.log(this.myForm.value);
      this.dataForm.emit(this.myForm.value);

    } else {
      console.log('INVALIDO:');

      Object.keys(this.myForm.controls).forEach(key => {
        const control = this.myForm.get(key);
        console.log('Control:', key, 'Errores:', control?.errors);
      });

      this.toastService.show(
        'Datos inválidos, verifique la información ingresada e intente nuevamente.',
        'text-bg-danger'
      )
    }
    console.log('--------------------------------');
  }

}
