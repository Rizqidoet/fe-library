import { Component, OnInit } from '@angular/core';
import { UserDto } from '../../model/user.model';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { ErrorMessage } from '../../../../../shared/dto/global-model.model';
import { UserService } from '../../service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {

  users: Array<UserDto> = [];
  params: Params = {};
  errorMessage!: ErrorMessage;
  selectedUser!: UserDto | null;

  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  // __________________________________________ onLoad Page
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe({
      next: (params: Params) => {
        this.params = params;
        this.loadData();
      }
    })
  }

  loadData() {
    this.params = this.payloadParams(this.params);
    this.filterQueryParam();
    this.userService.list(this.params).subscribe({
      next: ([users]) => {
        this.users = users;
      },
      error: () => {},
    })
  }

  // __________________________________________ onClick Function
  onDeleteEmployee(id: number) {
    this.userService.delete(id).subscribe({
      next: () => {
        this.loadData();
        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
      },
      error: (error: HttpErrorResponse) => this.handleError(error), 
    })
  }

  openDeleteModal(user: UserDto): void {
    this.selectedUser = user;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }

  // __________________________________________ helper Function
  payloadParams(current: Params): Params {
    return {
      term: `${current['term'] ? current['term'] : ''}`,
      page: `${current['page'] ? current['page'] : 1}`,
      rowsPerPage: `${current['rowsPerPage'] ? current['rowsPerPage'] : 10}`,
      order: `${current['order'] ? current['order'] : ''}`,
      sort: `${current['sort'] ? current['sort'] : ''}`,
      limit: `${current['limit'] ? current['limit'] : 10}`,
    };
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 400) {
      this.errorMessage = {
        ...this.errorMessage,
        statusCode: error.status,
        message: error?.error?.status?.description || error?.error?.message,
      };
      
      alert(`Request Failed, ${this.errorMessage.message}`);
    } else {
      this.errorMessage = {
        ...this.errorMessage,
        statusCode: error.status,
        message: error.statusText,
      };
      alert(`Something Went Wrong, ${this.errorMessage.message}`);
    }
  }

  navigate() {
    this.filterQueryParam();
    this.router.navigate([], {
        queryParams: this.params,
        relativeTo: this.activatedRoute,
        replaceUrl: true,
    }).then(() => {});
  }

  filterQueryParam() {
    const arrayParams = [
      'term',
      'page',
      'sort',
      'order',
      'rowsPerPage',
      'limit'
    ];
    for (let i = 0; i < arrayParams.length; i++) {
      const element = arrayParams[i];

      if (this.params[element] === '') {
        delete this.params[element];
      }
    }
  }
}
