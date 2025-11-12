import { InfoAcces } from "../../entity/user/interfaces/info-access.interface";
import { UserResponse } from "../../entity/user/interfaces/user.interface";

export interface ResponseGeneric {
  status: string;
  data:   InfoAcces | UserResponse | null;
  message: string | null;
}
