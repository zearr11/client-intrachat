import { UserResponse } from '../../../../core/interfaces/user.interface';
import { CampaignResponse } from '../../campaign/interfaces/campaign.interface';
import { HeadquartersResponse } from '../../headquarters/interfaces/headquarters.interface';

export interface OperationRequest {
  idCampania?: number;
  idJefeOperacion?: number;
  idSede?: number;
}

export interface OperationSpecialResponse {
  id: number;
  empresa: string;
  campania: string;
  sede: string;
  jefeOperacion: string;

  totalEquiposOperativos: number;
  totalEquiposInoperativos: number;

  totalUsuariosOperativos: number;
  totalUsuariosInoperativos: number;

  fechaCreacion: Date;
  fechaFinalizacion?: Date;
}

export interface OperationResponse {
  idOperacion: number;
  datosSede: HeadquartersResponse;
  datosCampania: CampaignResponse;
  datosJefeOperacion: UserResponse;
  fechaCreacion: Date;
  fechaFinalizacion: Date;
}
