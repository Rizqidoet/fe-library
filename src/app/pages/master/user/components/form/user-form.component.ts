import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Params, Router, RouterModule, ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { Roles } from '../../../../../shared/constant/constant';
import { UserService } from '../../service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorMessage } from '../../../../../shared/dto/global-model.model';
import { UserDto } from '../../model/user.model';
declare var bootstrap: any;

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    NgSelectModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit{

  userForm!: FormGroup;
  id!: number;
  params: Params = {};
  filteredRoles = Roles;
  errorMessage!: ErrorMessage;

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly ActivatedRoute: ActivatedRoute,
  ) {}

  // __________________________________________ onLoad Function
  ngOnInit(): void {
    this.buildForm();
    this.ActivatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.id = id;
        this.userService.getSingle(id).subscribe({
          next: (user) => {
            if (user) this.userForm.patchValue(user);
          },
          error: (error: HttpErrorResponse) => this.handleError(error),
        })
        
      }
    });
  }

  buildForm(): void {
    this.userForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      role: new FormControl(null, [Validators.required]),
    });
  }
  // __________________________________________ onClick Function
    ngSubmit() {
    if (!this.userForm.valid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const formValue = {...this.userForm.value, id: this.id}

    if (this.id) {
      this.updateUser(this.id, formValue);
    } else {
      this.createUser(formValue);
    }
  }

  updateUser(id: number, payload: UserDto) {
    this.userService.update(id, payload).subscribe({
      next: () => {
        const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        modal.show();
      },
      error: (error: HttpErrorResponse) => this.handleError(error),
    })
  }

  createUser(payload: UserDto) {
    this.userService.create(payload).subscribe({
      next: () => {
        const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        modal.show();
      },
      error: (error: HttpErrorResponse) => this.handleError(error),
    })
  }

  backToList() {
    bootstrap.Modal.getInstance(document.getElementById('confirmationModal')).hide();
    this.router.navigate(['/pages/master/user']);
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
