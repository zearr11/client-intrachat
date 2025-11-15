import { Gender } from "../enums/gender-user.enum";
import { Role } from "../enums/role-user.enum";
import { TipoDoc } from "../enums/tipo-doc-user.enum";

const VALUE_INITIAL = 'Seleccione';

export class EnumsList {

  static genders = [VALUE_INITIAL, Gender.MASCULINO, Gender.FEMENINO];
  static tipoDocs = [VALUE_INITIAL, TipoDoc.DNI, TipoDoc.CE];
  static roles = [VALUE_INITIAL, Role.ADMIN, Role.USUARIO];

}
