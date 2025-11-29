import { TypeMessage } from "../enums/type-message.enum";
import { DataUserResponse } from "../../contact/interfaces/contact.interface";
import { FileResponse } from "./file.interface";

export interface MessageResponse {
  idMensaje: number,
  remitente: DataUserResponse,
  tipoMensaje: TypeMessage,
  fechaEnvio: Date,
  archivoResponse?: FileResponse,
  contenido?: string
}
