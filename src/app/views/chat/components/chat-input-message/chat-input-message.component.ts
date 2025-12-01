import {
  Component,
  effect,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FileResponse } from '../../../../entity/message/interfaces/file.interface';

@Component({
  selector: 'chat-input-message',
  imports: [],
  templateUrl: './chat-input-message.component.html',
  styleUrl: './chat-input-message.component.css',
})
export class ChatInputMessageComponent {
  // Gestion de archivo
  private fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  fileOutput = output<File>();

  openFileDialog() {
    this.fileInput()?.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fileOutput.emit(file);
    }
  }

  // Gestion de texto
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
