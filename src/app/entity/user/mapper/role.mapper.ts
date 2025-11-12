import { Role } from "../interfaces/role-user.interface";

export class RoleMapper {

  static rolToRolUser(role: string) : Role {
    if (role === 'ADMIN')
      return Role.ROLE_ADMIN;

    if (role === 'SUPERVISOR_TI')
      return Role.ROLE_SUPERVISOR_TI;

    if (role === 'AGENTE_TI')
      return Role.ROLE_AGENTE_TI;

    if (role === 'JEFE_OPERACION')
      return Role.ROLE_JEFE_OPERACION;

    if (role === 'SUPERVISOR')
      return Role.ROLE_SUPERVISOR;

    return Role.ROLE_COLABORADOR;
  }

}
