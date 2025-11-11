import { UserResponse } from "../../admin/interfaces/user.interface";

export interface ResponseGeneric {
  status: string;
  data:   Info | UserResponse | null;
  message: string | null;
}

export interface Info {
  accessToken: string;
  rol: string;
}
