import { TypeRoom } from '../../../core/enums/type-room.enum';

export interface Contact {
  id: number;
  avatar: string;
  name: string;
  time: Date | string;
  content: string;
  type: TypeRoom;
  isToday: boolean;
}

export interface ContactResponse {
  idSala?: number; // Opcional
  tipoSala: TypeRoom; // Obligatorio
  datosMensaje?: DataMessageResponse; // Opcional
  datosGrupo?: DataGroupResponse; // Opcional
  datosUsuario?: DataUserResponse; // Opcional
  existeContactoPrevio: boolean; // Obligatorio
}

export interface DataMessageResponse {
  idMensaje: number;
  ultimoMensajeEsMio: boolean;
  texto: string;
  horaEnvio: Date;
}

export interface DataGroupResponse {
  idGrupo: number;
  urlFoto: string;
  nombreGrupo: string;
  descripcion: string;
}

export interface DataUserResponse {
  idUsuario: number;
  urlFoto: string;
  nombreYApellido: string;
  descripcion: string;
}
