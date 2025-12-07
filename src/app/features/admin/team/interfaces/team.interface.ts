import { UserResponse } from '../../../../core/interfaces/user.interface';
import { GroupResponse } from '../../../chat/interfaces/group.interface';
import { MemberCompleteResponse, MemberRequest } from '../../../chat/interfaces/room.interface';
import { OperationResponse } from '../../operation/interfaces/operation.interface';

export interface TeamRequest {
  idOperacion?: number;
  idSupervisor?: number;
  integrantes?: MemberRequest[];
}

export interface TeamRequest2 {
  nombre?: string;
  descripcion?: string;
  idOperacion?: number;
  idSupervisor?: number;
  integrantes?: MemberRequest[];
}

export interface TeamResponse {
  idEquipo: number;
  datosOperacion: OperationResponse;
  datosSupervisor: UserResponse;
  datosGrupo: GroupResponse;
  fechaCreacion: Date;
  fechaCierre?: Date;
  integrantes: MemberCompleteResponse[];
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
