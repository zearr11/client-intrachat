import { Component, output } from '@angular/core';
import { ChipMenuComponent } from "../../common/chip-menu/chip-menu.component";
import { RecentMessageContentComponent } from "../../common/recent-message-content/recent-message-content.component";
import { Contact } from '../../interfaces/contact.interface';

@Component({
  selector: 'right-panel',
  imports: [
    ChipMenuComponent,
    RecentMessageContentComponent
],
  templateUrl: './right-panel.component.html',
  styleUrl: './right-panel.component.css'
})
export class RightPanelComponent {

  valueSelected = output<number>();

  emitValue(value: number) {
    this.valueSelected.emit(value);
  }

  chats: Contact[] = [
    {
      id: 1,
      name: 'Equipo Ventas',
      content: 'Reunión confirmada para mañana',
      time: '10:45',
      avatar: 'https://i.pravatar.cc/50?img=12'
    },
    {
      id: 2,
      name: 'Soporte TI',
      content: 'El servidor ya está activo',
      time: '09:10',
      avatar: 'https://i.pravatar.cc/50?img=8'
    },
    {
      id: 3,
      name: 'Marketing',
      content: 'Enviar nueva propuesta de campaña',
      time: 'Ayer',
      avatar: 'https://i.pravatar.cc/50?img=5'
    }
  ];

}
