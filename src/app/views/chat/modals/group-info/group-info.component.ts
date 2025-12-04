import { Component, ElementRef, input, viewChild } from '@angular/core';
import { GroupResponse } from '../../../../entity/group/interfaces/group.interface';
import { Modal } from 'bootstrap';
import { DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'group-info',
  imports: [DatePipe, NgFor, NgIf],
  templateUrl: './group-info.component.html',
})
export class GroupInfoComponent {
  groupData = input.required<GroupResponse | null>();

  modalElement = viewChild<ElementRef<HTMLDivElement>>('modalElement');
  private modalInstance!: Modal;

  sortedMembers() {
    const members = this.groupData()?.sala?.integrantes ?? [];

    return [...members].sort((a, b) => {
      if (a.permiso === 'ADMINISTRADOR' && b.permiso !== 'ADMINISTRADOR')
        return -1;
      if (a.permiso !== 'ADMINISTRADOR' && b.permiso === 'ADMINISTRADOR')
        return 1;
      return 0;
    });
  }

  /* Asignacion como Elemento Modal */
  ngAfterViewInit() {
    this.modalInstance = new Modal(this.modalElement()!.nativeElement);
  }

  /* Mostrar modal */
  show() {
    this.modalInstance.show();
  }

  /* Ocultar modal */
  close() {
    this.modalInstance.hide();
  }
}
