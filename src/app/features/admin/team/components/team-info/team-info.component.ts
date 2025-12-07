import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Modal } from 'bootstrap';
import { TeamResponse } from '../../interfaces/team.interface';
import { TeamService } from '../../services/team.service';
import { DatePipe, NgClass, UpperCasePipe } from '@angular/common';
import { RemoveUnderScorePipe } from '../../../../../shared/pipes/remove-underscore.pipe';

@Component({
  selector: 'team-info',
  imports: [NgClass, DatePipe, RemoveUnderScorePipe, UpperCasePipe],
  templateUrl: './team-info.component.html',
})
export class TeamInfoComponent {
  private teamService = inject(TeamService);

  idTeam = input.required<number | null>();
  team = signal<TeamResponse | null>(null);

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
}
