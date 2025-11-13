import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PaginatedResponse } from '../../../../shared/interfaces/paginated-response.interface';
import { UserService } from '../../../../entity/user/services/user.service';
import { UserResponse } from '../../../../entity/user/interfaces/user.interface';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'user-page',
  imports: [
    DatePipe,
    TitleCasePipe
  ],
  templateUrl: './user-page.component.html',
})
export class UserPageComponent implements OnInit {

  userService = inject(UserService);
  dataPaginated = signal<PaginatedResponse<UserResponse>|null>(null);

  nothingShowInTable = computed<boolean>(() =>
    this.dataPaginated()?.totalPages == 0
          || this.dataPaginated()?.totalPages == this.dataPaginated()?.page
  );

  showActives = signal<boolean>(true);
  pageCurrent = signal<number | null>(null);
  filter = signal<string>('');

  ngOnInit(): void {
    this.userService.getUsersPaginated().subscribe((resp) => {
      this.dataPaginated.set(resp);
    });
  }

  showInfo(id: number) {
    console.log('ver info');
  }

  showModalEdit(id: number) {
    console.log('editar info');
  }

  showModalDelete(id: number) {
    console.log('borrar');
  }

  changeState(number: string) {
    if (number == '1')
      this.showActives.set(true);
    else
      this.showActives.set(false);

    this.pageCurrent.set(null);
    this.filter.set('');

    this.userService.getUsersPaginated(
      {
        state: this.showActives()
      }
    ).subscribe((resp) => {
      this.dataPaginated.set(resp);
    });
  }

  nextPage(page: number) {
    this.pageCurrent.set(page);
    this.userService.getUsersPaginated(
      {
        page: this.pageCurrent() ?? undefined,
        filter: this.filter(),
        state: this.showActives()
      }
    ).subscribe((resp) => {
      this.dataPaginated.set(resp);
    });
  }

  changePage(isNext: boolean) {
    if (isNext) {
      this.nextPage((this.pageCurrent()! + 1))
      return;
    }

    this.nextPage((this.pageCurrent()! - 1))
  }

  setFilterPaginated() {
    this.pageCurrent.set(null);
    this.userService.getUsersPaginated(
      {
        filter: this.filter(),
        state: this.showActives()
      }
    ).subscribe((resp) => {
      this.dataPaginated.set(resp);
    });
  }

  clearFilters() {
    this.filter.set('');
    this.pageCurrent.set(null);
    this.userService.getUsersPaginated(
      {
        state: this.showActives()
      }
    ).subscribe((resp) => {
      this.dataPaginated.set(resp);
    });
  }

}
