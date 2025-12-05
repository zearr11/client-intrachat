export interface OptionsPaginated {
  page?: number;
  size?: number;
  estado: boolean;
  filtro?: string;
}

export interface OptionsPaginatedMessage {
  page?: number;
  size?: number;
  filtro?: string;
}

export interface OptionsPaginatedOperation {
  page?: number;
  size?: number;
  estado?: boolean;
  idCampania?: number;
}
