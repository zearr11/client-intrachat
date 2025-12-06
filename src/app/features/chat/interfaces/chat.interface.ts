import { TypeMessage } from "../../../core/enums/type-message.enum";
import { TypeRoom } from "../../../core/enums/type-room.enum";
import { FileResponse } from "../../../core/interfaces/file.interface";
import { UserResponse } from "../../../core/interfaces/user.interface";
import { GroupResponse } from "./group.interface";

export interface ChatRequest {
  idSala?: number;
  idUsuarioDestino?: number;
  tipoSala: TypeRoom;
  tipoMensaje?: TypeMessage;
  archivo?: File
  texto?: string;
}

export interface ChatResponse {
  idSala: number;
  idMensaje: number;
  usuarioRemitente: UserResponse;
  usuarioDestino?: UserResponse;
  grupoDestino?: GroupResponse;
  tipoSala: TypeRoom;
  tipoMensaje: TypeMessage;
  archivoResponse?: FileResponse;
  texto?: string;
  horaEnvio: Date;
}
