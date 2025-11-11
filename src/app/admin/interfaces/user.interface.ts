export interface UserResponse {
  id:                 number;
  urlFoto:            string;
  nombres:            string;
  apellidos:          string;
  tipoDoc:            string;
  numeroDoc:          string;
  genero:             string;
  celular:            string;
  email:              string;
  rol:                string;
  fechaCreacion:      Date;
  ultimaModificacion: Date;
  estado:             boolean;
}
