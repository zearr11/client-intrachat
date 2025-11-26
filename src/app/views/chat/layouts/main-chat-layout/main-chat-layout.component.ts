import { Component } from '@angular/core';
import { IconMenuComponent } from "../../common/icon-menu/icon-menu.component";
import { ChatRecentlyComponent } from "../../components/chat-recently/chat-recently.component";
import { Contact } from '../../interfaces/contact.interface';
import { RouterOutlet } from '@angular/router';
import { TypeRoom } from '../../../../entity/room/enums/type-room.enum';

@Component({
  selector: 'main-chat-layout',
  imports: [
    IconMenuComponent,
    ChatRecentlyComponent,
    RouterOutlet
],
  templateUrl: './main-chat-layout.component.html',
})
export class MainChatLayoutComponent {

  dataMemory: Contact = {
    id: 1,
    avatar: "intrachat.png",
    name: "Juan Perez",
    content: "prueba mensaje",
    time: new Date(),
    unread: 2,
    type: TypeRoom.PRIVADO
  }

  dataMemory2: Contact = {
    id: 2,
    avatar: "intrachat.png",
    name: "Jhon Doe",
    content: "prueba mensaje 2",
    time: new Date(),
    unread: 0,
    type: TypeRoom.PRIVADO
  }

}
