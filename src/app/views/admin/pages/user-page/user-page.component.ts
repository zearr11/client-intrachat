import { Component, inject, OnInit, signal } from '@angular/core';
import { PaginatedResponse } from '../../../../shared/interfaces/paginated-response.interface';
import { UserService } from '../../../../entity/user/services/user.service';
import { UserResponse } from '../../../../entity/user/interfaces/user.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'user-page',
  imports: [
    DatePipe
  ],
  templateUrl: './user-page.component.html',
})
export class UserPageComponent implements OnInit {

  userService = inject(UserService);
  dataPaginated = signal<PaginatedResponse<UserResponse>|null>(null);

  showActives = signal<boolean>(true);

  ngOnInit(): void {
    this.userService.getUsersPaginated().subscribe((resp) => {
      this.dataPaginated.set(resp);
    });
  }

  showInfo(id: number) {

  }

  showModalEdit(id: number) {

  }

  showModalDelete(id: number) {

  }

  changeState(number: string) {
    if (number == '1') {
      this.showActives.set(true);
      return;
    }
    this.showActives.set(false);
  }

}
