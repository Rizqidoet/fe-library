import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RentListComponent } from './components/list/rent-list.component';
import { RentFormComponent } from './components/form/rent-form/rent-form.component';

const routes: Routes = [
  {
      path: '',
      component: RentListComponent,
    },
    {
      path: 'form',
      component: RentFormComponent,
    },
    {
      path: 'form/:id',
      component: RentFormComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RentRoutingModule { }
