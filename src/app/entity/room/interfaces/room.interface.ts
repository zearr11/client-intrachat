import { TypeRoom } from "../enums/type-room.enum";

export interface RoomResponse {
  id: number,
  fechaCreacion: Date,
  tipoSala: TypeRoom
}
