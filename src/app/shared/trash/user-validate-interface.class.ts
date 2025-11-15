import { UserResponse } from "../../entity/user/interfaces/user.interface";

export class UserValidateInterface {

  static isUserResponse(obj: any): obj is UserResponse {
    return (
      obj !== null &&
      typeof obj === 'object' &&

      // id: number
      typeof obj.id === 'number' &&

      // urlFoto: string
      typeof obj.urlFoto === 'string' &&

      // nombres: string
      typeof obj.nombres === 'string' &&

      // apellidos: string
      typeof obj.apellidos === 'string' &&

      // tipoDoc: TipoDoc (enum u objeto)
      obj.tipoDoc !== undefined &&

      // numeroDoc: string
      typeof obj.numeroDoc === 'string' &&

      // genero: Gender
      obj.genero !== undefined &&

      // celular: string
      typeof obj.celular === 'string' &&

      // email: string
      typeof obj.email === 'string' &&

      // rol: RoleRegular
      obj.rol !== undefined &&

      // fechaCreacion: Date | string (backend puede mandar string)
      (obj.fechaCreacion instanceof Date || typeof obj.fechaCreacion === 'string') &&

      // ultimaModificacion: Date | string
      (obj.ultimaModificacion instanceof Date || typeof obj.ultimaModificacion === 'string') &&

      // estado: boolean
      typeof obj.estado === 'boolean'
    );
  }

};
