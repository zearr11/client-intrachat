import { Component, input } from '@angular/core';
import { Contact } from '../../interfaces/contact.interface';
import { DatePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'chat-recently',
  imports: [
    DatePipe,
    RouterLink,
    RouterLinkActive
],
  templateUrl: './chat-recently.component.html',
})
export class ChatRecentlyComponent {

  dataMessageRecently = input.required<Contact>();
  isLast = input<boolean>(false);

}
