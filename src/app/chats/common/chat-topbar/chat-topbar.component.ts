import { Component, input } from '@angular/core';
import { InfoContact } from '../../interfaces/info.contact.interface';

@Component({
  selector: 'chat-topbar',
  imports: [],
  templateUrl: './chat-topbar.component.html',
  styleUrl: './chat-topbar.component.css'
})
export class ChatTopbarComponent {

  infoContact = input.required<InfoContact>();

}
