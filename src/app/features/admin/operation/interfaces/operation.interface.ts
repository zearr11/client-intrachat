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
