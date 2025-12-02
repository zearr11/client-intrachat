import { TypeRoom } from '../../room/enums/type-room.enum';

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
