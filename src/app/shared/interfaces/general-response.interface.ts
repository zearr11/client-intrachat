export interface ResponseGeneric<T> {
  status: string;
  data:   T | null;
  message: string | null;
}
