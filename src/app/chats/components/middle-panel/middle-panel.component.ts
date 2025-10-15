import { Component, input } from '@angular/core';
import { ChatTopbarComponent } from "../../common/chat-topbar/chat-topbar.component";
import { InfoContact } from '../../interfaces/info.contact.interface';
import { ChatMessageComponent } from "../../common/chat-message/chat-message.component";
import { Message } from '../../interfaces/message.interface';
import { ChatInputMessageComponent } from "../../common/chat-input-message/chat-input-message.component";

@Component({
  selector: 'middle-panel',
  imports: [
    ChatTopbarComponent,
    ChatMessageComponent,
    ChatInputMessageComponent
],
  templateUrl: './middle-panel.component.html',
  styleUrl: './middle-panel.component.css'
})
export class MiddlePanelComponent {

  header = input.required<InfoContact>();
  messages = input.required<Message[]>();

}
