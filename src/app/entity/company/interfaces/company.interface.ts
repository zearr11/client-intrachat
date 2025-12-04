export interface CompanyRequest {
  razonSocial: string;
  nombreComercial: string;
  ruc: string;
  correo: string;
  telefono: string;
}

export interface CompanyRequest2 {
  razonSocial?: string;
  nombreComercial?: string;
  ruc?: string;
  correo?: string;
  telefono?: string;
  estado?: boolean;
}

export interface CompanyResponse {
  id: number;
  razonSocial: string;
  nombreComercial: string;
  ruc: string;
  correo: string;
  telefono: string;
  estado: boolean;
}
