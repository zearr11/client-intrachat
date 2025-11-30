import { Component, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'chat-input-message',
  imports: [],
  templateUrl: './chat-input-message.component.html',
  styleUrl: './chat-input-message.component.css',
})
export class ChatInputMessageComponent {
  resetTxt = input<boolean>();
  value = signal('');

  reset = effect(() => {
    const reset = this.resetTxt();
    this.value.set('');
  });

  textMessage = output<string>();

  sendText(txt: string) {
    this.textMessage.emit(txt);
    this.value.set('');
  }
}
