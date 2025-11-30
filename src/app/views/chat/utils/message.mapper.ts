import { ChatResponse } from '../../../entity/chat/interfaces/chat.interface';
import { DataUserResponse } from '../../../entity/contact/interfaces/contact.interface';
import { FileResponse } from '../../../entity/message/interfaces/file.interface';
import { MessageResponse } from '../../../entity/message/interfaces/message.interface';
import { UserMapper } from '../../../entity/user/mapper/user.mapper';

export class MessageMapper {
  static messageResponse(chatResponse: ChatResponse): MessageResponse {
    const dataUserSender: DataUserResponse = {
      idUsuario: chatResponse.usuarioRemitente.id,
      urlFoto: chatResponse.usuarioRemitente.urlFoto,
      nombreYApellido: UserMapper.userToFirstNameAndLastname(
        chatResponse.usuarioRemitente.nombres,
        chatResponse.usuarioRemitente.apellidos
      ),
      descripcion: chatResponse.usuarioRemitente.informacion,
    };

    const fileData: FileResponse | undefined = chatResponse.archivoResponse
      ? {
          id: chatResponse.archivoResponse.id,
          nombre: chatResponse.archivoResponse.nombre,
          tamanio: chatResponse.archivoResponse.tamanio,
          tipo: chatResponse.archivoResponse.tipo,
          url: chatResponse.archivoResponse.url,
        }
      : undefined;

    return {
      idMensaje: chatResponse.idMensaje,
      remitente: dataUserSender,
      tipoMensaje: chatResponse.tipoMensaje,
      fechaEnvio: chatResponse.horaEnvio,
      archivoResponse: fileData,
      contenido: chatResponse.texto,
    };
  }
}
