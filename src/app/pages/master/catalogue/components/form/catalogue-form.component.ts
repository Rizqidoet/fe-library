import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Params, Router, RouterModule, ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ErrorMessage } from '../../../../../shared/dto/global-model.model';;
import { CatalogueService } from '../../service/catalogue.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserDto } from '../../../user/model/user.model';
import { CatalogueDto } from '../../model/catalogue.model';
declare var bootstrap: any;

@Component({
  selector: 'app-catalogue-form',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    NgSelectModule
  ],
  templateUrl: './catalogue-form.component.html',
  styleUrl: './catalogue-form.component.scss'
})
export class CatalogueFormComponent implements OnInit {

  catalogueForm!: FormGroup;
  id!: number;
  params: Params = {};
  errorMessage!: ErrorMessage;

  constructor(
    private readonly catalogueService: CatalogueService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

 // __________________________________________ onLoad Function
  ngOnInit(): void {
    this.buildForm();
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.id = id;
        this.catalogueService.getSingle(id).subscribe({
          next: (catalogue) => {
            if (catalogue) this.catalogueForm.patchValue(catalogue);
          },
          error: (error: HttpErrorResponse) => this.handleError(error),
        })
        
      }
    });
  }

  buildForm(): void {
    this.catalogueForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      stok: new FormControl(0, [Validators.required]),
      author: new FormControl(null, [Validators.required]),
    });
  }
  // __________________________________________ onClick Function
    ngSubmit() {
    if (!this.catalogueForm.valid) {
      this.catalogueForm.markAllAsTouched();
      return;
    }
    const formValue = {...this.catalogueForm.value, id: this.id}

    if (this.id) {
      this.updateUser(this.id, formValue);
    } else {
      this.createUser(formValue);
    }
  }

  updateUser(id: number, payload: CatalogueDto) {
    this.catalogueService.update(id, payload).subscribe({
      next: () => {
        const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        modal.show();
      },
      error: (error: HttpErrorResponse) => this.handleError(error),
    })
  }

  createUser(payload: CatalogueDto) {
    this.catalogueService.create(payload).subscribe({
      next: () => {
        const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        modal.show();
      },
      error: (error: HttpErrorResponse) => this.handleError(error),
    })
  }

  backToList() {
    bootstrap.Modal.getInstance(document.getElementById('confirmationModal')).hide();
    this.router.navigate(['/pages/master/catalogue']);
  }


  // __________________________________________ helper Function
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

}
