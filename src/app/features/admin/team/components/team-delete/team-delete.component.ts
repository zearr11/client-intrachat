import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { TeamService } from '../../services/team.service';
import { TeamResponse } from '../../interfaces/team.interface';
import { Modal } from 'bootstrap';
import { DatePipe } from '@angular/common';
import { ToastMessageService } from '../../../../../shared/services/toast-message.service';

@Component({
  selector: 'team-delete',
  imports: [DatePipe],
  templateUrl: './team-delete.component.html',
})
export class TeamDeleteComponent {
  private teamService = inject(TeamService);
  private toastService = inject(ToastMessageService);

  idTeam = input.required<number | null>();
  team = signal<TeamResponse | null>(null);

  membersActives = computed(() => {
    const team = this.team();
    if (!team) return [];

    return team.datosGrupo.sala.integrantes.filter((v) => v.estado);
  });

  /* Referencia al modal actual */
  modalElement = viewChild<ElementRef<HTMLDivElement>>('modalElement');
  modalInstance = signal<Modal | null>(null);

  /* Asignacion como Elemento Modal */
  ngAfterViewInit() {
    this.modalInstance.set(new Modal(this.modalElement()!.nativeElement));
  }

  /* Mostrar modal */
  show() {
    this.loadTeam();
    this.modalInstance()!.show();
  }

  close() {
    this.modalInstance()!.hide();
  }

  loadTeamEffect = effect(() => {
    const id = this.idTeam();
    if (!id) return;

    this.loadTeam();
  });

  loadTeam = () => {
    const id = this.idTeam();
    if (!id) return;

    this.teamService.getTeamById(id).subscribe((data) => {
      if (!data) return;
      this.team.set(data);
    });
  };

  updateTable = output<boolean>();

  confirmDisableTeam() {
    this.teamService.dissableTeam(this.idTeam()!).subscribe((msg) => {
      if (msg) {
        this.toastService.show(msg, 'text-bg-success');
        this.updateTable.emit(true);
        this.close();
      }
    });
  }
}
