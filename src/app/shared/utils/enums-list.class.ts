import { Gender } from '../../core/enums/gender-user.enum';
import { Permission } from '../../core/enums/permission.enum';
import { Role } from '../../core/enums/role-user.enum';
import { TypeDoc } from '../../core/enums/type-doc-user.enum';

const VALUE_INITIAL = 'Seleccione';

export class EnumsList {
  static genders = [VALUE_INITIAL, Gender.MASCULINO, Gender.FEMENINO];
  static tipoDocs = [VALUE_INITIAL, TypeDoc.DNI, TypeDoc.CE];
  static roles = [VALUE_INITIAL, Role.ADMIN, Role.USUARIO];
  static permissions = [
    Permission.USUARIO_REGULAR,
    Permission.ADMINISTRADOR,
  ];
}
