import { Gender } from "../enums/gender-user.enum";
import { RoleRegular } from "../enums/role-regular.enum";
import { TipoDoc } from "../enums/tipo-doc-user.enum";

const VALUE_INITIAL = 'Seleccione';

export class EnumsList {

  static genders = [VALUE_INITIAL, Gender.MASCULINO, Gender.FEMENINO];
  static tipoDocs = [VALUE_INITIAL, TipoDoc.DNI, TipoDoc.CE];

  static getRolesPermited(roleUserCurrent: RoleRegular) {
    const rolesAdmin = [VALUE_INITIAL];

    if (roleUserCurrent == RoleRegular.ADMIN) {
      rolesAdmin.push(
        RoleRegular.ADMIN, RoleRegular.SUPERVISOR_TI, RoleRegular.AGENTE_TI,
      )
    } else if (roleUserCurrent == RoleRegular.SUPERVISOR_TI) {
      rolesAdmin.push(RoleRegular.AGENTE_TI)
    }

    rolesAdmin.push(
      RoleRegular.JEFE_OPERACION,
      RoleRegular.SUPERVISOR, RoleRegular.COLABORADOR
    )

    return rolesAdmin;
  }

}
