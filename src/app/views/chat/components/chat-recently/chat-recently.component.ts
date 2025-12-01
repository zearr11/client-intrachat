import { Component, computed, input } from '@angular/core';
import { Contact } from '../../interfaces/contact.interface';
import { DatePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ContactResponse } from '../../../../entity/contact/interfaces/contact.interface';
import { TruncateTextPipe } from '../../pipes/truncate-text.pipe';
import { typesIconMenu } from '../../layouts/main-chat-layout/main-chat-layout.component';

@Component({
  selector: 'chat-recently',
  imports: [DatePipe, RouterLink, RouterLinkActive, TruncateTextPipe],
  templateUrl: './chat-recently.component.html',
})
export class ChatRecentlyComponent {
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

    let time: string = '';
    let content: string = '';

    if (this.viewCurrent() === 'recently') {
      // ------------------------------------
      // SOLO mostrar datos del mensaje
      // ------------------------------------
      time = contact.existeContactoPrevio
        ? contact.datosMensaje?.horaEnvio.toString() ?? ''
        : '';

      content = contact.existeContactoPrevio
        ? contact.datosMensaje?.texto ?? ''
        : '';
    } else {
      // ------------------------------------
      // Mostrar lo “otro”
      // (descripcion usuario / descripcion grupo)
      // ------------------------------------
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
    };

    // console.log(contactMapped);

    return contactMapped;
  }
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
