import { Component, computed, inject, input } from '@angular/core';
import { MessageResponse } from '../../../../entity/message/interfaces/message.interface';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../../entity/user/services/user.service';
import { FileResponse } from '../../../../entity/message/interfaces/file.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'chat-message',
  imports: [DatePipe],
  templateUrl: './chat-message.component.html',
})
export class ChatMessageComponent {
  private userService = inject(UserService);
  private http = inject(HttpClient);

  // Entidad mensaje con mucha data
  dataMessage = input.required<MessageResponse>();

  // true = Es un mensaje del usuario logeado, false = es cualquier otro usuario
  isMe = computed(() => {
    return (
      this.userService.dataUser()?.id == this.dataMessage().remitente.idUsuario
    );
  });

  // true = Es chat entre 2, false = es chat grupal
  isChatPrivate = input.required<boolean>();

  downloadFile(file: FileResponse) {
    const url = file.url;
    const nombre = file.nombre;

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = nombre; // nombre real
        link.click();

        window.URL.revokeObjectURL(blobUrl);
      },
      error: () => {
        console.error('Error al descargar archivo');
      },
    });
  }
}

// Entidad archivo
// dataFile = input<FileResponse>();
// Entidad texto
// dataText = input<TextResponse>();

// Enum con tipo de mensaje
/*
    VALORES PARA TIPO DE SALA:
    this.dataMessage().sala.tipoSala == TypeRoom.GRUPO
    this.dataMessage().sala.tipoSala == TypeRoom.PRIVADO

    VALORES PARA TIPOS DE MENSAJE
    this.dataMessage().tipo == TypeMessage.MSG_TEXTO
    this.dataMessage().tipo == TypeMessage.MSG_IMAGEN
    this.dataMessage().tipo == TypeMessage.MSG_ARCHIVO

    VALORES PARA USUARIO
    this.dataMessage().usuario.username = Nombre del usuario
    this.dataMessage().usuario.urlFoto = Imagen del usuario que envio el mensaje

    VALORES DE MENSAJE
    this.dataMessage().fechaCreacion
    this.dataMessage().archivo = Si es MSG_ARCHIVO o MSG_IMAGEN, esta propiedad existe
    tiene las propiedades: nombre, tamanio, tipo(ejm: pdf/png/jpg) y url.

    this.dataMessage().texto = Si es MSG_TEXTO tiene el texto del mensaje.
  */

/*
  - Si soy yo = derecha
  - Si no soy yo = izquierda

  - Si soy yo o es chat privado = Sin foto de usuario y sin username en el contenido del mensaje
  - Si es chat grupal y no soy yo = Con foto y username en el contenido del mensaje
  - Si es chat grupal y soy yo = Sin foto de usuario y sin username en el contenido del mensaje

  - Si es texto, incluir tambien solo el contenido del texto usando la propiedad: this.dataMessage().texto
  - Si es imagen, implementar diseño para mostrar una imagen en el mensaje usando la propiedad:
    this.dataMessage().archivo.url
  - Si es archivo, implementar diseño para mostrar el archivo, con un icono de descarga
    y al hacer click en ese icono se descargue el archivo: usar la propiedad this.dataMessage().archivo y su contenido
  */
