import { FileResponse } from '../interfaces/file.interface';
import { MessageResponse } from '../../features/chat/interfaces/message.interface';
import { UserMapper } from './user.mapper';
import { ChatResponse } from '../../features/chat/interfaces/chat.interface';
import { DataUserResponse } from '../../features/chat/interfaces/contact.interface';

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
