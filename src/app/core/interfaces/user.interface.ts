import { Gender } from '../enums/gender-user.enum';
import { Position } from '../enums/position-user.enum';
import { Role } from '../enums/role-user.enum';
import { TypeDoc } from '../enums/type-doc-user.enum';

export interface UserRequest {
  nombres: string;
  apellidos: string;
  tipoDoc: TypeDoc;
  numeroDoc: string;
  genero: Gender;
  celular: string;
  email: string;
  rol: Role;
  cargo: Position;
}

export interface UserRequest2 {
  nombres?: string;
  apellidos?: string;
  tipoDoc?: TypeDoc;
  numeroDoc?: string;
  genero?: Gender;
  celular?: string;
  informacion?: string;
  email?: string;
  password?: string;
  rol?: Role;
  cargo?: Position;
  estado?: boolean;
}

export interface UserResponse {
  id: number;
  urlFoto: string;
  nombres: string;
  apellidos: string;
  tipoDoc: TypeDoc;
  numeroDoc: string;
  genero: Gender;
  celular: string;
  email: string;
  rol: Role;
  cargo: Position;
  fechaCreacion: Date;
  ultimaModificacion: Date;
  estado: boolean;
  informacion: string;
}
