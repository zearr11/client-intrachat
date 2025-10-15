import { Component, input, output } from '@angular/core';
import { Contact } from '../../interfaces/contact.interface';

@Component({
  selector: 'recent-message-content',
  imports: [],
  templateUrl: './recent-message-content.component.html',
  styleUrl: './recent-message-content.component.css'
})
export class RecentMessageContentComponent {

  chat = input.required<Contact>();
  idContactValue = output<number>();

  changeIdContact(value: number) {
    this.idContactValue.emit(value);
  }

}
