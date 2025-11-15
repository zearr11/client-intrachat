import { Role } from "../../../entity/user/enums/role-user.enum";

export interface InfoAccess {
  accessToken: string;
  rol: Role;
}
