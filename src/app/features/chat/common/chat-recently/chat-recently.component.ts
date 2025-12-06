import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Contact, ContactResponse } from '../../interfaces/contact.interface';
import { DatePipe } from '@angular/common';
import { TruncateTextPipe } from '../../../../shared/pipes/truncate-text.pipe';
import { typesIconMenu } from '../../../../core/layouts/main-chat-layout/main-chat-layout.component';
import { TypeRoom } from '../../../../core/enums/type-room.enum';
import { NotificationService } from '../../services/notification.service';
import { ChatResponse } from '../../interfaces/chat.interface';

export interface minDataContact {
  typeChat?: TypeRoom;
  idUserReceiver?: number;
  idRoom?: number;
}

@Component({
  selector: 'chat-recently',
  imports: [DatePipe, TruncateTextPipe],
  templateUrl: './chat-recently.component.html',
})
export class ChatRecentlyComponent {
  private notificationService = inject(NotificationService);

  dataContact = input.required<ContactResponse>();
  isLast = input<boolean>(false);
  dataMessageRecently = computed(() => this.convertDataContactToContact());
  viewCurrent = input.required<typesIconMenu>();

  convertDataContactToContact() {
    const contact = this.dataContact();
    const typeRoom = contact.tipoSala;

    const id =
      typeRoom == 'PRIVADO' ? contact.datosUsuario!.idUsuario : contact.idSala;

    const avatar =
      typeRoom == 'PRIVADO'
        ? contact.datosUsuario!.urlFoto
        : contact.datosGrupo!.urlFoto;

    const name =
      typeRoom == 'PRIVADO'
        ? contact.datosUsuario!.nombreYApellido
        : contact.datosGrupo!.nombreGrupo;

    let isToday = false;
    let time: string = '';
    let content: string = '';

    if (this.viewCurrent() === 'recently') {
      time = contact.existeContactoPrevio
        ? contact.datosMensaje?.horaEnvio.toString() ?? ''
        : '';

      content = contact.existeContactoPrevio
        ? contact.datosMensaje?.texto ?? ''
        : '';

      if (time != '' && time) {
        const d = new Date(time);
        const today = new Date();

        isToday =
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate();
      }
    } else {
      time = '';

      if (typeRoom === 'PRIVADO') {
        content = contact.datosUsuario?.descripcion ?? '';
      } else {
        content = contact.datosGrupo?.descripcion ?? '';
      }
    }

    const contactMapped: Contact = {
      id: id as number,
      avatar,
      name,
      time,
      content,
      type: typeRoom,
      isToday,
    };

    return contactMapped;
  }

  newMessage = input.required<ChatResponse>();
  inAnimation = signal<boolean>(false);
  finishAnimation = output<boolean>();

  ngOnChanges() {
    if (!this.newMessage()) return;

    if (
      this.newMessage().idMensaje == this.dataContact().datosMensaje?.idMensaje
    ) {
      this.reproduceAnimation();
      this.notificationService.emitSound();
    }
  }

  reproduceAnimation() {
    this.inAnimation.set(false);

    setTimeout(() => {
      this.inAnimation.set(true);

      setTimeout(() => {
        this.inAnimation.set(false);
        this.finishAnimation.emit(true);
      }, 600);
    });
  }

  valuesContact = output<minDataContact>();

  openChatsFromContact() {
    const values: minDataContact = {
      typeChat: this.dataMessageRecently().type,
    };

    if (values.typeChat == 'PRIVADO')
      values.idUserReceiver = this.dataMessageRecently().id;
    else values.idRoom = this.dataMessageRecently().id;

    this.valuesContact.emit(values);
  }

  valueSelected = input.required<number | null>();
  valueElement = input.required<number>();
}

/*
const time = contact.existeContactoPrevio
      ? contact.datosMensaje!.horaEnvio
      : '';

    const content = contact.existeContactoPrevio
      ? contact.datosMensaje!.texto
      : typeRoom == 'PRIVADO'
      ? contact.datosUsuario!.descripcion
      : contact.datosGrupo!.descripcion;
*/
