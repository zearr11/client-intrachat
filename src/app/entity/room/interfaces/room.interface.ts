import { Permission } from '../../../shared/enums/permission.enum';
import { UserResponse } from '../../user/interfaces/user.interface';
import { TypeRoom } from '../enums/type-room.enum';

/*
export interface RoomResponse {
  id: number,
  fechaCreacion: Date,
  tipoSala: TypeRoom
}
*/

export interface RoomResponse {
  id: number;
  tipoSala: TypeRoom;
  fechaCreacion: Date;
  integrantes: MemberResponse[];
}

export interface MemberResponse {
  estado: boolean;
  permiso: Permission;
  usuarioResponse: UserResponse
}
