import { Component, computed, input } from '@angular/core';
import { Contact } from '../../interfaces/contact.interface';
import { DatePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ContactResponse } from '../../../../entity/contact/interfaces/contact.interface';

@Component({
  selector: 'chat-recently',
  imports: [DatePipe, RouterLink, RouterLinkActive],
  templateUrl: './chat-recently.component.html',
})
export class ChatRecentlyComponent {
  dataContact = input.required<ContactResponse>();
  isLast = input<boolean>(false);
  dataMessageRecently = computed(() => this.convertDataContactToContact());

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

    const time = contact.existeContactoPrevio
      ? contact.datosMensaje!.horaEnvio
      : '';

    const content = contact.existeContactoPrevio
      ? contact.datosMensaje!.texto
      : typeRoom == 'PRIVADO'
      ? contact.datosUsuario!.descripcion
      : contact.datosGrupo!.descripcion;

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
