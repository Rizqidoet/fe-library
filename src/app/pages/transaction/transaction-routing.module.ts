import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'rent',
    pathMatch: 'full',
  },
  {
    path: 'rent',
     loadChildren: () => import('./rent/rent.module').then(m => m.RentModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
