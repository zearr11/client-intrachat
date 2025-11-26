import { Component, ElementRef, viewChild } from '@angular/core';
import { ChatInputMessageComponent } from '../../components/chat-input-message/chat-input-message.component';
import { ChatMessageComponent } from '../../components/chat-message/chat-message.component';
import { MessageResponse } from '../../../../entity/message/interfaces/message.interface';
import { TypeMessage } from '../../../../entity/message/enums/type-message.enum';
import { TypeRoom } from '../../../../entity/room/enums/type-room.enum';
import { TipoDoc } from '../../../../entity/user/enums/tipo-doc-user.enum';
import { Gender } from '../../../../entity/user/enums/gender-user.enum';
import { Role } from '../../../../entity/user/enums/role-user.enum';
import { FileResponse } from '../../../../entity/message/interfaces/file.interface';
import { TextResponse } from '../../../../entity/message/interfaces/text.interface';

@Component({
  selector: 'chat-current-page',
  imports: [ChatInputMessageComponent, ChatMessageComponent],
  templateUrl: './chat-current-page.component.html',
})
export class ChatCurrentPageComponent {

  scrollContainer = viewChild<ElementRef>('scrollContainer');

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnChanges() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    if (!this.scrollContainer) return;

    const el = this.scrollContainer()?.nativeElement;
    el.scrollTop = el.scrollHeight;
  }

  data: MessageResponse = {
    id: 1,
    fechaCreacion: new Date(),
    tipo: TypeMessage.MSG_TEXTO,
    ultimaModificacion: new Date(),
    sala: {
      id: 10,
      fechaCreacion: new Date(),
      tipoSala: TypeRoom.GRUPO,
    },
    usuario: {
      id: 101,
      urlFoto: 'https://cdn-icons-png.flaticon.com/512/204/204191.png',
      nombres: 'Cesar Junior',
      apellidos: 'Gamarra Rivera',
      tipoDoc: TipoDoc.DNI,
      numeroDoc: '12345678',
      genero: Gender.MASCULINO,
      celular: '987654321',
      email: 'cesar@example.com',
      rol: Role.USUARIO, // O ADMIN, etc.
      fechaCreacion: new Date('2024-01-01'),
      ultimaModificacion: new Date(),
      estado: true,
    },
  };

  data2: MessageResponse = {
    id: 2,
    fechaCreacion: new Date(),
    tipo: TypeMessage.MSG_IMAGEN,
    ultimaModificacion: new Date(),

    sala: {
      id: 11,
      fechaCreacion: new Date(),
      tipoSala: TypeRoom.GRUPO,
    },

    usuario: {
      id: 205,
      urlFoto:
        'https://img.freepik.com/vector-premium/imagen-perfil-avatar-hombre-ilustracion-vectorial_268834-538.jpg?w=740',
      nombres: 'Luis Fernando',
      apellidos: 'Salazar Paredes',
      tipoDoc: TipoDoc.CE,
      numeroDoc: 'X9876543',
      genero: Gender.MASCULINO,
      celular: '912345678',
      email: 'luis.salazar@example.com',
      rol: Role.ADMIN,
      fechaCreacion: new Date('2024-03-10'),
      ultimaModificacion: new Date(),
      estado: true,
    },
  };

  fileData: FileResponse = {
    id: 1,
    nombre: 'documento.pdf',
    tamanio: 204800,
    tipo: 'application/pdf',
    url: 'https://images.unsplash.com/photo-1512850183-6d7990f42385?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVydGljYWwlMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D',
  };

  textData: TextResponse = {
    id: 1,
    contenido: 'Este es un mensaje de ejemplo para el chat.',
  };
}
