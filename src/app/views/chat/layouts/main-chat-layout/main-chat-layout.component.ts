import { Component } from '@angular/core';
import { IconMenuComponent } from "../../common/icon-menu/icon-menu.component";
import { ChatRecentlyComponent } from "../../components/chat-recently/chat-recently.component";
import { Contact } from '../../interfaces/contact.interface';
import { RouterOutlet } from "../../../../../../node_modules/@angular/router/router_module.d-Bx9ArA6K";

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
    unread: 2
  }

}
