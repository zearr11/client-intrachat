import { Gender } from "./gender-user.interface";
import { Role } from "./role-user.interface";
import { TipoDoc } from "./tipo-doc-user.interface";

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
  rol:                string;
  fechaCreacion:      Date;
  ultimaModificacion: Date;
  estado:             boolean;
}
