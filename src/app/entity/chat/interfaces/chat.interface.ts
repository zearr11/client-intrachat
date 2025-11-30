import { GroupResponse } from '../../group/interfaces/group.interface';
import { TypeMessage } from '../../message/enums/type-message.enum';
import { FileResponse } from '../../message/interfaces/file.interface';
import { TypeRoom } from '../../room/enums/type-room.enum';
import { UserResponse } from '../../user/interfaces/user.interface';

export interface ChatRequest {
  idSala?: number;
  idUsuarioDestino?: number;
  tipoSala: TypeRoom;
  tipoMensaje: TypeMessage;
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
