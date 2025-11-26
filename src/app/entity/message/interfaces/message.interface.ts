import { TypeMessage } from "../enums/type-message.enum";
import { RoomResponse } from "../../room/interfaces/room.interface";
import { UserResponse } from "../../user/interfaces/user.interface";

export interface MessageResponse {
  id: number,
  fechaCreacion: Date,
  tipo: TypeMessage,
  ultimaModificacion: Date,
  sala: RoomResponse,
  usuario: UserResponse
}
