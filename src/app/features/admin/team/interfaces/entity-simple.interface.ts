import { Permission } from "../../../../core/enums/permission.enum";

export interface EntitySimple {
  id: number; // id de entidad
  descripcion: string; // detalle
  isSelected: boolean; // seleccionado o no
  permission?: Permission // Permiso en grupo
}
