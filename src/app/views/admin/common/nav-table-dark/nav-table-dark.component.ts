import { Component, input, output } from '@angular/core';
import { PaginatedResponse } from '../../../../shared/interfaces/paginated-response.interface';

@Component({
  selector: 'nav-table-dark',
  imports: [],
  templateUrl: './nav-table-dark.component.html',
})
export class NavTableDarkComponent {

  dataPaginated = input.required<PaginatedResponse<Object> | null>();
  isTableWithoutData = input.required<boolean>();

  nextPage = output<number>();
  changePage = output<boolean>();

}
