export interface OptionsPaginated {
  page?: number;
  size?: number;
  estado: boolean;
  filtro?: string;
}

export interface OptionsPaginatedSimple {
  page?: number;
  size?: number;
  filtro?: string;
}

export interface OptionsPaginatedUserOperation {
  page?: number;
  size?: number;
  filtro?: string;
  idOperacion?: number;
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
  filtro?: string;
}
