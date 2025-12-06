import { AreaAttention } from '../../../../core/enums/area-attention.enum';
import { MediaOutlet } from '../../../../core/enums/media-outlet.enum';

export interface CampaignRequest {
  nombre: string;
  idEmpresa: number;
  areaAtencion: AreaAttention;
  medioComunicacion: MediaOutlet;
}

export interface CampaignRequest2 {
  nombre: string;
  idEmpresa: number;
  areaAtencion: AreaAttention;
  medioComunicacion: MediaOutlet;
  estado: boolean;
}

/*
export interface CampaignResponse {
  id: number,
  nombre: string,
  empresa: CompanyResponse,
  areaAtencion: AreaAtencion,
  medioComunicacion: MedioComunicacion,
  estado: boolean,
  fechaCreacion: Date,
  ultimaModificacion: Date
}
*/

export interface CampaignSimpleResponse {
  id: number;
  campania: string;
}

export interface CampaignEspecialResponse {
  id: number;
  nombreComercialEmpresa: string;
  areaAtencion: AreaAttention;
  medioComunicacion: MediaOutlet;

  totalOperacionesActivas: number;
  totalOperacionesInactivas: number;

  totalEquiposActivos: number;
  totalEquiposInactivos: number;

  totalUsuariosActivos: number;
  totalUsuariosInactivos: number;

  estado: boolean;
  fechaCreacion: Date;
  ultimaModificacion: Date;
}
