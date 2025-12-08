import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ToastMessageService } from '../../../../../shared/services/toast-message.service';
import { CampaignService } from '../../services/campaign.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CompanyService } from '../../../company/services/company.service';
import {
  CampaignRequest2,
  CampaignResponse,
} from '../../interfaces/campaign.interface';
import { Modal } from 'bootstrap';
import { CompanyResponse } from '../../../company/interfaces/company.interface';
import { EnumsList } from '../../../../../shared/utils/enums-list.class';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, firstValueFrom, map, of, pipe, tap } from 'rxjs';
import { FunctionsGenerics } from '../../../../../shared/utils/functions-generics.class';
import { RemoveUnderScorePipe } from '../../../../../shared/pipes/remove-underscore.pipe';
import { AreaAttention } from '../../../../../core/enums/area-attention.enum';
import { MediaOutlet } from '../../../../../core/enums/media-outlet.enum';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'campaign-edit',
  imports: [ReactiveFormsModule, RemoveUnderScorePipe],
  templateUrl: './campaign-edit.component.html',
})
export class CampaignEditComponent {
  private formGroup = inject(FormBuilder);
  private toastService = inject(ToastMessageService);
  private campaignService = inject(CampaignService);
  private companyService = inject(CompanyService);

  /* Signals */
  idCampaign = input.required<number | null>();
  updateTable = output<boolean>();

  /* SELECTS */
  companys = signal<CompanyResponse[] | null>(null);
  mediaOutlets = EnumsList.mediaOutlets;
  areasAttention = EnumsList.areasAttention;

  /* Referencia al modal actual */
  modalElement = viewChild<ElementRef<HTMLDivElement>>('modalElement');
  modalInstance = signal<Modal | null>(null);

  /* Asignacion como Elemento Modal */
  ngAfterViewInit() {
    this.modalInstance.set(new Modal(this.modalElement()!.nativeElement));
  }

  /* Mostrar modal */
  show() {
    this.modalInstance()!.show();
  }

  /* Ocultar modal */
  close() {
    this.modalInstance()!.hide();
  }

  loadEffect = effect(() => {
    if (!this.idCampaign()) return;

    this.companyService.getAllCompanys().subscribe((resp) => {
      this.companys.set(resp.data);

      this.campaignService
        .getCampaignById(this.idCampaign()!)
        .subscribe((resp) => {
          this.myForm.reset({
            idEmpresa: resp.data?.datosEmpresa.id,
            areaAtencion: FunctionsGenerics.removeUnderscoreFormat(
              resp.data?.areaAtencion!
            ),
            medioComunicacion: FunctionsGenerics.removeUnderscoreFormat(
              resp.data?.medioComunicacion!
            ),
          });
        });
    });
  });

  myForm: FormGroup = this.formGroup.group({
    idEmpresa: ['', [Validators.required]],
    areaAtencion: ['', [Validators.required]],
    medioComunicacion: ['', [Validators.required]],
  });

  submitForm() {
    if (this.myForm.invalid) {
      console.log('INVALIDO:');

      Object.keys(this.myForm.controls).forEach((key) => {
        const control = this.myForm.get(key);
        console.log('Control:', key, 'Errores:', control?.errors);
      });

      this.toastService.show(
        'Datos inválidos, verifique los datos enviados e intente nuevamente.',
        'text-bg-danger'
      );
      console.log('--------------------------------');
      return;
    }

    const updatedCampaign: CampaignRequest2 = {
      idEmpresa: this.myForm.value.idEmpresa,
      areaAtencion: FunctionsGenerics.toUpperUnderscore(
        this.myForm.value.areaAtencion
      ) as AreaAttention,
      medioComunicacion: FunctionsGenerics.toUpperUnderscore(
        this.myForm.value.medioComunicacion
      ) as MediaOutlet,
    };

    this.campaignService
      .updateCampaign(this.idCampaign()!, updatedCampaign)
      .subscribe({
        next: (msg) => {
          this.toastService.show(
            'Campaña actualizada satisfactoriamente',
            'text-bg-success'
          );
          this.updateTable.emit(true);
          this.close();
        },
        error: (err: HttpErrorResponse) => {
          this.toastService.show(err.message, 'text-bg-danger');
        },
      });
  }
}
