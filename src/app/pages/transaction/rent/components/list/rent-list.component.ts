import { Component, OnInit } from '@angular/core';
import { TrxRentDto } from '../../model/rent.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Params, Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ErrorMessage } from '../../../../../shared/dto/global-model.model';
import { RentService } from '../../service/rent.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-rent-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './rent-list.component.html',
  styleUrl: './rent-list.component.scss'
})
export class RentListComponent implements OnInit {

  rents: Array<TrxRentDto> = [];
  params: Params = {};
  errorMessage!: ErrorMessage;
  selectedRent!: TrxRentDto | null;

  constructor(
    private rentService: RentService,
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
    this.rentService.list(this.params).subscribe({
      next: ([rents]) => {
        rents.map((rent) => {
          const today = new Date();
          const returnDate = new Date(rent.returnDate);

          if (returnDate < today && rent.isActive) {
            rent.isLate = true;
          } else {
            rent.isLate = false;
          }

          return rent;
        })
        this.rents = rents;
      },
      error: (error: HttpErrorResponse) => this.handleError(error),
    })
  }

  // __________________________________________ onClick Function
  onDeleteRent(id: number) {
    this.rentService.delete(id).subscribe({
      next: () => {
        this.loadData();
        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
      },
      error: (error: HttpErrorResponse) => this.handleError(error), 
    })
  }

  openDeleteModal(rent: TrxRentDto): void {
    this.selectedRent = rent;
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
