import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { Message } from '../../interfaces/message.interface';

@Component({
  selector: 'chat-message',
  imports: [
    NgClass
  ],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.css'
})
export class ChatMessageComponent {

  messageBody = input.required<Message>();
  isFirst = input.required<boolean>();
  isLast = input.required<boolean>();

}
