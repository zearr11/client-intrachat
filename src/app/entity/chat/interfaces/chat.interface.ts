import { TypeMessage } from "../../message/enums/type-message.enum";
import { TypeRoom } from "../../room/enums/type-room.enum";
import { UserResponse } from "../../user/interfaces/user.interface";

export interface ChatRequest {
  idSala?: number,
  idUsuario?: number,
  tipoSala: TypeRoom,
  tipoMensaje: TypeMessage,
  texto?: string
}

export interface ChatResponse {
  idSala: number,
  usuarioRemitente: UserResponse,
  usuarioDestino?: UserResponse,
  grupoDestino?: any,
  tipoSala: TypeRoom,
  tipoMensaje: TypeMessage,
  archivoResponse?: any,
  texto?: string,
  horaEnvio: Date
}
