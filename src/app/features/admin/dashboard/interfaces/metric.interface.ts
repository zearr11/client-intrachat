import { UserResponse } from '../../../../core/interfaces/user.interface';

export interface AlertResponse {
  jefesOperacionSinAsignar: UserResponse[];
  supervisoresSinAsignar: UserResponse[];
  colaboradoresSinAsignar: UserResponse[];
}

export interface InfoDailyResponse {
  usuariosDeshabilitadosHoy: number;
  operacionesFinalizadasHoy: number;
  equiposFinalizadosHoy: number;
  mensajesEnviadosHoy: number;
}

export interface InfoGeneralResponse {
  usuariosActivos: number;
  usuariosInactivos: number;

  empresasActivas: number;
  empresasInactivas: number;

  sedesActivas: number;
  sedesInactivas: number;

  campaniasActivas: number;
  campaniasInactivas: number;

  operacionesActivas: number;
  operacionesInactivas: number;

  equiposActivos: number;
  equiposInactivos: number;
}

export interface NewUsersPerMonthResponse {
  nombreMes: string;
  cantidad: number;
}

export interface MessagesAveragePerMonthResponse {
  nombreMes: string;
  cantidadMensajes: number;
  promedio: number;
}
