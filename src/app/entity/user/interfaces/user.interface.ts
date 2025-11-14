import { Gender } from "../enums/gender-user.enum";
import { RoleRegular } from "../enums/role-regular.enum";
import { TipoDoc } from "../enums/tipo-doc-user.enum";

export interface UserRequest {
  nombres:            string;
  apellidos:          string;
  tipoDoc:            TipoDoc;
  numeroDoc:          string;
  genero:             Gender;
  celular:            string;
  email:              string;
  rol:                RoleRegular;
}

export interface UserRequest2 {
  nombres?:            string;
  apellidos?:          string;
  tipoDoc?:            TipoDoc;
  numeroDoc?:          string;
  genero?:             Gender;
  celular?:            string;
  informacion?:        string;
  email?:              string;
  password?:           string;
  rol?:                RoleRegular;
  estado?:             boolean;
}

export interface UserResponse {
  id:                 number;
  urlFoto:            string;
  nombres:            string;
  apellidos:          string;
  tipoDoc:            TipoDoc;
  numeroDoc:          string;
  genero:             Gender;
  celular:            string;
  email:              string;
  rol:                RoleRegular;
  fechaCreacion:      Date;
  ultimaModificacion: Date;
  estado:             boolean;
}
