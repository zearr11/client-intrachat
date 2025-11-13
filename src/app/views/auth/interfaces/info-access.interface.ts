import { RoleComplete } from "../../../entity/user/enums/role-complete.enum";

export interface InfoAccess {
  accessToken: string;
  rol: RoleComplete;
}
