import {
  Component,
  ElementRef,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ToastMessageService } from '../../../../../shared/services/toast-message.service';
import { CampaignService } from '../../services/campaign.service';
import { CampaignRequest } from '../../interfaces/campaign.interface';
import { Modal } from 'bootstrap';
import { EnumsList } from '../../../../../shared/utils/enums-list.class';
import { CompanyService } from '../../../company/services/company.service';
import { CompanyResponse } from '../../../company/interfaces/company.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of, tap } from 'rxjs';
import { RemoveUnderScorePipe } from '../../../../../shared/pipes/remove-underscore.pipe';
import { UpperCasePipe } from '@angular/common';
import { FunctionsGenerics } from '../../../../../shared/utils/functions-generics.class';
import { AreaAttention } from '../../../../../core/enums/area-attention.enum';
import { MediaOutlet } from '../../../../../core/enums/media-outlet.enum';

@Component({
  selector: 'campaign-add',
  imports: [ReactiveFormsModule, RemoveUnderScorePipe],
  templateUrl: './campaign-add.component.html',
})
export class CampaignAddComponent {
  private formGroup = inject(FormBuilder);
  private toastService = inject(ToastMessageService);
  private campaignService = inject(CampaignService);
  private companyService = inject(CompanyService);

  /* Signals */
  dataNewCampaign = signal<CampaignRequest | null>(null);
  updateTable = output<boolean>();

  /* Referencia al modal actual */
  modalElement = viewChild<ElementRef<HTMLDivElement>>('modalElement');
  modalInstance = signal<Modal | null>(null);

  /* Asignacion como Elemento Modal */
  ngAfterViewInit() {
    this.modalInstance.set(new Modal(this.modalElement()!.nativeElement));
  }

  /* Mostrar modal */
  show() {
    this.myForm.reset({
      areaAtencion: '',
      medioComunicacion: '',
    });
    this.loadCompanys();
    this.modalInstance()!.show();
  }

  /* Ocultar modal */
  close() {
    this.modalInstance()!.hide();
  }

  /* SELECTS */
  companys = signal<CompanyResponse[] | null>(null);
  mediaOutlets = EnumsList.mediaOutlets;
  areasAttention = EnumsList.areasAttention;

  loadCompanys() {
    this.companyService.getAllCompanys().subscribe((resp) => {
      if (resp) {
        this.companys.set(resp.data);
      }
    });
  }

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

    const newCampaign: CampaignRequest = {
      idEmpresa: this.myForm.value.idEmpresa,
      areaAtencion: FunctionsGenerics.toUpperUnderscore(
        this.myForm.value.areaAtencion
      ) as AreaAttention,
      medioComunicacion: FunctionsGenerics.toUpperUnderscore(
        this.myForm.value.medioComunicacion
      ) as MediaOutlet,
    };

    this.dataNewCampaign.set(newCampaign);
  }

  /* ---------------------------- HTTP ------------------------------- */

  httpCreateNewCampaign = rxResource({
    request: () => ({ data: this.dataNewCampaign() }),
    loader: ({ request }) => {
      if (!request.data) return of({ error: true });

      return this.campaignService.registerCampaign(request.data).pipe(
        tap((msg) => {
          this.dataNewCampaign.set(null);
          this.toastService.show(
            'Campaña registrada satisfactoriamente',
            'text-bg-success'
          );
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
