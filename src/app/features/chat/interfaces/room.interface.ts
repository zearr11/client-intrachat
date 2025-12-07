import { Permission } from '../../../core/enums/permission.enum';
import { TypeRoom } from '../../../core/enums/type-room.enum';
import { UserResponse } from '../../../core/interfaces/user.interface';

export interface RoomRequest {
  tipoSala: TypeRoom;
  integrantes: MemberRequest[];
}

export interface MemberRequest {
  tipoPermiso: Permission;
  idUsuario: number;
}

export interface RoomResponse {
  id: number;
  tipoSala: TypeRoom;
  fechaCreacion: Date;
  integrantes: MemberResponse[];
}

export interface MemberResponse {
  estado: boolean;
  permiso: Permission;
  usuarioResponse: UserResponse;
}

export interface MemberCompleteResponse {
  idEquipoUsuario: number;
  fechaInicio: Date;
  fechaFin?: Date;
  permiso: Permission;
  datosIntegrante: UserResponse;
}

/*
export interface RoomResponse {
  id: number,
  fechaCreacion: Date,
  tipoSala: TypeRoom
}
*/
