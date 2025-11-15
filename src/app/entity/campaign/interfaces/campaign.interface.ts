import { CompanyResponse } from "../../company/interfaces/company.interface";
import { AreaAtencion } from "../enums/area-atencion.enum";
import { MedioComunicacion } from "../enums/medio-comunicacion.enum";

export interface CampaignRequest {
  nombre: string,
  idEmpresa: number,
  areaAtencion: AreaAtencion,
  medioComunicacion: MedioComunicacion
}

export interface CampaignRequest2 {
  nombre: string,
  idEmpresa: number,
  areaAtencion: AreaAtencion,
  medioComunicacion: MedioComunicacion,
  estado: boolean
}

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
