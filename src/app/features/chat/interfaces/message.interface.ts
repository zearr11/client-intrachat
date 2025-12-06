import { TypeMessage } from '../../../core/enums/type-message.enum';
import { FileResponse } from '../../../core/interfaces/file.interface';
import { DataUserResponse } from './contact.interface';

export interface MessageResponse {
  idMensaje: number;
  remitente: DataUserResponse;
  tipoMensaje: TypeMessage;
  fechaEnvio: Date;
  archivoResponse?: FileResponse;
  contenido?: string;
}
