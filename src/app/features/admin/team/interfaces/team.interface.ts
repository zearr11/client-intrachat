import { MemberRequest } from "../../../chat/interfaces/room.interface";

export interface TeamRequest {
  idOperacion?: number;
  idSupervisor?: number;
  integrantes?: MemberRequest[];
}

export interface TeamSpecialResponse {
  id: number;
  sede: string;
  campania: string;
  jefeOperacion: string;
  supervisor: string;
  nombreEquipo: string;
  integrantesOperativos: number;
  integrantesInoperativos: number;
  promedioMensajesDiarios: number;
  fechaCreacion: Date;
  fechaCierre?: Date;
}
