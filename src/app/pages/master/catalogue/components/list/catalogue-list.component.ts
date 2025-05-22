import { Component, OnInit } from '@angular/core';
import { CatalogueDto } from '../../model/catalogue.model';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { ErrorMessage } from '../../../../../shared/dto/global-model.model';
import { CatalogueService } from '../../service/catalogue.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../user/service/user.service';
import { UserDto } from '../../../user/model/user.model';
import { Subject } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import { RentService } from '../../../../transaction/rent/service/rent.service';
import { TrxRentDto } from '../../../../transaction/rent/model/rent.model';
declare var bootstrap: any;

@Component({
  selector: 'app-catalogue-list',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    NgSelectModule
  ],
  templateUrl: './catalogue-list.component.html',
  styleUrl: './catalogue-list.component.scss'
})
export class CatalogueListComponent implements OnInit {

  catalogue: Array<CatalogueDto> = [];
  params: Params = {};
  errorMessage!: ErrorMessage;
  selectedCatalogue!: CatalogueDto;
  rentForm!: FormGroup;

  users: Array<UserDto> = [];
  userSubject: Subject<string> = new Subject<string>();
  userLoading: boolean = false;

  constructor(
    private catalogueService: CatalogueService,
    private userService: UserService,
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
    this.buildForm();
    this.params = this.payloadParams(this.params);
    this.filterQueryParam();
    this.catalogueService.list(this.params).subscribe({
      next: ([catalogue]) => {
        this.catalogue = catalogue;
      },
      error: () => {},
    });

    this.loadDataUser();
  }

  buildForm(): void {
    this.rentForm = new FormGroup({
      userId: new FormControl(null),
      categoryId: new FormControl(null),
      rentDate: new FormControl(null, [Validators.required]),
      returnDate: new FormControl(null, [Validators.required]),
      isActive: new FormControl(null),
    });
  }

  loadDataUser() {
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
  openDeleteModal(catalogue: CatalogueDto): void {
    this.selectedCatalogue = catalogue;
    const modal = new bootstrap.Modal(document.getElementById('popupFormRent'));
    modal.show();
  }

  ngSubmit() {
    if (this.selectedCatalogue) {
      if (!this.rentForm.valid) {
        this.rentForm.markAllAsTouched();
        return;
      }
      const formValue = this.rentForm.value;
      const payload = {
        ...formValue,
        catalogueId: this.selectedCatalogue.id,
        isActive: true
      };

      this.createUser(payload);  
    }
  }

  createUser(payload: TrxRentDto) {
    this.rentService.create(payload).subscribe({
      next: () => {
        const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        modal.show();
      },
      error: (error: HttpErrorResponse) => this.handleError(error),
    })
  }

  backToList() {
    bootstrap.Modal.getInstance(document.getElementById('popupFormRent')).hide();
    bootstrap.Modal.getInstance(document.getElementById('confirmationModal')).hide();
    this.loadData();
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
