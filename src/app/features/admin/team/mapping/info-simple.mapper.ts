import { Permission } from '../../../../core/enums/permission.enum';
import { UserResponse } from '../../../../core/interfaces/user.interface';
import { OperationSpecialResponse } from '../../operation/interfaces/operation.interface';
import { EntitySimple } from '../interfaces/entity-simple.interface';

export class InfoSimpleMapper {
  static transformOperation(operation: OperationSpecialResponse) {
    const data: EntitySimple = {
      id: operation.id,
      descripcion: `${operation.jefeOperacion} - ${operation.empresa} - ${operation.sede}`,
      isSelected: false,
    };

    return data;
  }

  static transformUser(user: UserResponse) {
    const data: EntitySimple = {
      id: user.id,
      descripcion: `${user.nombres} ${user.apellidos} - ${user.tipoDoc} ${user.numeroDoc}`,
      isSelected: false,
      permission: Permission.USUARIO_REGULAR
    };

    return data;
  }
}

// ejm para operacion: Lucia Salazar Peña - Movistar - Lima Ate
// ejm para supervisor: Jose Pedro Perez Lujan - DNI 87812321
// ejm para miembro: Leonel Paras Ñupo - CE 823127372
