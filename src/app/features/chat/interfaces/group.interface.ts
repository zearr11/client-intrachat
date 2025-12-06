import { RoomResponse } from './room.interface';

export interface GroupResponse {
  id: number;
  nombre: string;
  descripcion: string;
  urlFoto: string;
  sala: RoomResponse;
  ultimaModificacion: Date;
  estado: boolean;
}
