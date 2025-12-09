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
import { OperationService } from '../../services/operation.service';
import { ToastMessageService } from '../../../../../shared/services/toast-message.service';
import { OperationResponse } from '../../interfaces/operation.interface';
import { Modal } from 'bootstrap';

@Component({
  selector: 'operation-delete',
  imports: [],
  templateUrl: './operation-delete.component.html',
})
export class OperationDeleteComponent {
  private operationService = inject(OperationService);
  private toastService = inject(ToastMessageService);

  idOperation = input.required<number>();
  operation = signal<OperationResponse | null>(null);
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
    this.loadOperation();
    this.modalInstance()!.show();
  }

  close() {
    this.modalInstance()!.hide();
  }

  loadOperationEffect = effect(() => {
    const id = this.idOperation();
    if (!id) return;

    this.loadOperation();
  });

  loadOperation = () => {
    const id = this.idOperation();
    if (!id) return;

    this.operationService.getOperationById(id).subscribe((data) => {
      if (!data) return;
      this.operation.set(data);
    });
  };

  confirmDisableOperation() {
    this.operationService
      .deleteOperation(this.idOperation()!)
      .subscribe((msg) => {
        if (msg) {
          this.toastService.show(msg, 'text-bg-success');
          this.updateTable.emit(true);
          this.close();
        }
      });
  }
}
