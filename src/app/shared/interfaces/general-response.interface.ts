import { Status } from '../enums/status.enum';

export interface ResponseGeneric<T> {
  status: Status;
  data: T | null;
  message: string | null;
}
