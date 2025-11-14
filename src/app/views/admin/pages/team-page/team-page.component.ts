import { Component, inject } from '@angular/core';
import { ModalPersonalizedService } from '../../../../shared/services/modal-personalized.service';

@Component({
  selector: 'team-page',
  imports: [],
  templateUrl: './team-page.component.html',
})
export class TeamPageComponent {

  private modalService = inject(ModalPersonalizedService);

  // apertureModal() {
  //   this.modalService.show();
  // }

}
