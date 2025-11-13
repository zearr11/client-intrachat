import { RoleComplete } from "../enums/role-complete.enum";
import { RoleRegular } from "../enums/role-regular.enum";

export class RoleMapper {

  static rolToRolUser(role: RoleRegular) : RoleComplete {
    if (role === RoleRegular.ADMIN)
      return RoleComplete.ROLE_ADMIN;

    if (role === RoleRegular.SUPERVISOR_TI)
      return RoleComplete.ROLE_SUPERVISOR_TI;

    if (role === RoleRegular.AGENTE_TI)
      return RoleComplete.ROLE_AGENTE_TI;

    if (role === RoleRegular.JEFE_OPERACION)
      return RoleComplete.ROLE_JEFE_OPERACION;

    if (role === RoleRegular.SUPERVISOR)
      return RoleComplete.ROLE_SUPERVISOR;

    return RoleComplete.ROLE_COLABORADOR;
  }

}
