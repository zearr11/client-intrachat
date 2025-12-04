import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { UserService } from '../../../../entity/user/services/user.service';
import { Modal } from 'bootstrap';
import {
  UserRequest2,
  UserResponse,
} from '../../../../entity/user/interfaces/user.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastMessageService } from '../../../../shared/services/toast-message.service';
import { Patterns } from '../../../../entity/user/utils/patterns.class';

@Component({
  selector: 'management-account',
  imports: [ReactiveFormsModule],
  templateUrl: './management-account.component.html',
})
export class ManagementAccountComponent {
  private formGroup = inject(FormBuilder);
  private toastService = inject(ToastMessageService);
  private userService = inject(UserService);

  userCurrent = signal<UserResponse | null>(null);
  imgUser = signal<string | File | null>(null);

  modalElement = viewChild<ElementRef<HTMLDivElement>>('modalElement');
  private modalInstance!: Modal;

  updateCurrentUserGeneral() {
    this.userService.loadDataCurrentUser().subscribe((inObject) => {
      if (inObject) {
        this.userCurrent.set(this.userService.dataUser());
        this.imgUser.set(this.userService.dataUser()!.urlFoto);
      }
    });
  }

  /* Asignacion como Elemento Modal */
  ngAfterViewInit() {
    this.modalInstance = new Modal(this.modalElement()!.nativeElement);
  }

  editSwitch = viewChild<ElementRef<HTMLInputElement>>('editSwitch');

  /* Mostrar modal */
  show() {
    this.editSwitch()!.nativeElement.checked = false;
    this.myForm.reset();

    this.updateCurrentUserGeneral();

    this.editEnabled.set(false);
    this.passEnabled.set(false);

    this.modalInstance.show();
  }

  /* Ocultar modal */
  close() {
    this.modalInstance.hide();
  }

  myForm: FormGroup = this.formGroup.group({
    celular: [
      '',
      [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
        Validators.pattern(/^9\d{8}$/),
      ],
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(Patterns.emailPattern),
        Validators.maxLength(100),
      ],
    ],
    informacion: ['', [Validators.required, Validators.maxLength(100)]],
    passNueva: [''],
    passNuevaConfirm: [''],
  });

  setData = effect(
    () => {
      const user = this.userCurrent();
      if (!user) return;

      this.myForm.patchValue({
        celular: user.celular ?? '',
        email: user.email ?? '',
        informacion: user.informacion ?? '',
      });
    },
    { allowSignalWrites: true }
  );

  dissableForm = effect(() => {
    const editable = this.editEnabled();
    if (editable) {
      this.myForm.get('informacion')?.enable();
      this.myForm.get('email')?.enable();
      this.myForm.get('celular')?.enable();
    } else {
      this.myForm.get('informacion')?.disable();
      this.myForm.get('email')?.disable();
      this.myForm.get('celular')?.disable();
    }
  });

  editEnabled = signal<boolean>(false);
  passEnabled = signal<boolean>(false);

  dissableBtnChange = computed(() => {
    return !(this.editEnabled() || this.passEnabled());
  });

  toggleEdit(event: any) {
    this.editEnabled.set(event.target.checked);
  }

  fileNewImage = signal<File | null>(null);

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.toastService.show(
        'El archivo seleccionado no es una imagen válida.',
        'text-bg-danger'
      );
      return;
    }

    const tempUrl = URL.createObjectURL(file);
    this.imgUser.set(tempUrl);

    this.fileNewImage.set(file);
    input.value = '';

    this.uploadImage();
  }

  uploadImage() {
    this.toastService.show('Actualizando foto de perfil...', 'text-bg-info');

    this.userService
      .updatePhotoUser(this.userCurrent()!.id, this.fileNewImage())
      .subscribe({
        next: (msg) => {
          this.toastService.show(
            'Imagen actualizada satisfactoriamente.',
            'text-bg-success'
          );
        },
        error: (err) => {
          this.toastService.show(err.message, 'text-bg-danger');
        },
      });
  }

  updateDataUser(dataUpdate: UserRequest2) {
    this.userService
      .updateDataUser(this.userCurrent()!.id, dataUpdate)
      .subscribe({
        next: (msg) => {
          this.toastService.show(
            'Información actualizada satisfactoriamente.',
            'text-bg-success'
          );
        },
        error: (err) => {
          this.toastService.show(err.message, 'text-bg-danger');
        },
      });
  }

  onSaveChanges() {
    this.validateForm();
  }

  validateForm() {
    this.myForm.controls['passNueva'].setErrors(null);
    this.myForm.controls['passNuevaConfirm'].setErrors(null);

    const pass = this.myForm.controls['passNueva'].value ?? '';
    const confirm = this.myForm.controls['passNuevaConfirm'].value ?? '';

    if (pass || confirm) {
      this.validatePass(pass, confirm);
    }

    if (this.myForm.invalid) {
      console.log('INVALIDO:');

      Object.keys(this.myForm.controls).forEach((key) => {
        const control = this.myForm.get(key);
        console.log('Control:', key, 'Errores:', control?.errors);
      });
      console.log('--------------------------------');

      const { celular, email, informacion } = this.myForm.controls;

      if (celular.errors || email.errors || informacion.errors) {
        this.toastService.show(
          'Datos inválidos, verifique la información ingresada e intente nuevamente.',
          'text-bg-danger'
        );
      }
      return;
    }

    const newPass = this.myForm.value.passNueva;

    const dataUpdateUser: UserRequest2 = {
      celular: this.myForm.value.celular,
      email: this.myForm.value.email,
      informacion: this.myForm.value.informacion,
      password: newPass ? newPass : null,
    };

    this.updateDataUser(dataUpdateUser);
  }

  effectPass = effect(() => {
    this.myForm
      .get('passNueva')
      ?.valueChanges.subscribe(() => this.activatedBtnPass());
    this.myForm
      .get('passNuevaConfirm')
      ?.valueChanges.subscribe(() => this.activatedBtnPass());
  });

  activatedBtnPass() {
    const pass = this.myForm.controls['passNueva'].value ?? '';
    const confirm = this.myForm.controls['passNuevaConfirm'].value ?? '';

    if (!pass && !confirm) {
      this.passEnabled.set(false);
      return;
    }

    if (pass || confirm) {
      this.passEnabled.set(true);
    }
  }

  validatePass(pass: string, confirm: string) {
    let errorValue;
    const design = 'text-bg-danger';

    // ---- VALIDACIONES DE CONTRASEÑA ----
    if (pass.length < 8) {
      this.myForm.controls['passNueva'].setErrors({ minLength: true });
      errorValue = 'La contraseña debe tener al menos 8 caracteres.';
    } else if (!/[A-Z]/.test(pass)) {
      this.myForm.controls['passNueva'].setErrors({ upper: true });
      errorValue = 'La contraseña debe contener al menos una letra mayúscula.';
    } else if (!/[a-z]/.test(pass)) {
      this.myForm.controls['passNueva'].setErrors({ lower: true });
      errorValue = 'La contraseña debe contener al menos una letra minúscula.';
    } else if (!/[0-9]/.test(pass)) {
      this.myForm.controls['passNueva'].setErrors({ number: true });
      errorValue = 'La contraseña debe contener al menos un número.';
    } else if (!/[^A-Za-z0-9]/.test(pass)) {
      this.myForm.controls['passNueva'].setErrors({ special: true });
      errorValue = 'La contraseña debe incluir al menos un carácter especial.';
    } else if (!confirm) {
      this.myForm.controls['passNuevaConfirm'].setErrors({ require: true });
      errorValue = 'Debe repetir la nueva contraseña.';
    }
    // ---- VALIDACIÓN DE CONFIRMACIÓN ----
    else if (confirm && pass !== confirm) {
      this.myForm.controls['passNuevaConfirm'].setErrors({ mismatch: true });
      errorValue = 'Las contraseñas no coinciden.';
    }

    if (errorValue) {
      this.toastService.show(errorValue, design);
      return;
    }
  }
}
