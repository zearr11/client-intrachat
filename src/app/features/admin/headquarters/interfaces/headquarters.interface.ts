export interface HeadquartersRequest {
  nombre: string;
  direccion: string;
  numeroPostal: number;
}

export interface HeadquartersRequest2 {
  nombre?: string;
  direccion?: string;
  numeroPostal?: number;
  estado?: boolean;
}

export interface HeadquartersResponse {
  id: number;
  nombre: string;
  direccion: string;
  codigoPostal: number;
  estado: boolean;
}
