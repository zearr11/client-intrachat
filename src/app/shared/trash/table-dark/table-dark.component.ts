import { Component, computed, input } from '@angular/core';
import { PaginatedResponse } from '../../interfaces/paginated-response.interface';
import { UserResponse } from '../../../entity/user/interfaces/user.interface';
import { UserValidateInterface } from '../../validators/user-validate-interface.class';

@Component({
  selector: 'table-dark',
  imports: [],
  templateUrl: './table-dark.component.html',
})
export class TableDarkComponent<T> {

  headersTable = input.required<string[]>();
  paginatedGeneric = input<PaginatedResponse<Object> | null>();

  paginatedUser = computed(() => {
    const listPaginated = this.paginatedGeneric()?.result;
    let isUser = false;

    if (listPaginated)
      isUser = UserValidateInterface.isUserResponse(listPaginated[0])

    if (isUser)
      return listPaginated as UserResponse[];

    return [];
  })

  showInfo(id: number) {
    console.log('ver info');
  }

  showModalEdit(id: number) {
    console.log('editar info');
  }

  showModalDelete(id: number) {
    console.log('borrar');
  }


}
