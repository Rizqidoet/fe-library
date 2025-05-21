import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'user',
     loadChildren: () => import('./user/user.module').then(m => m.UserModule),
  },
  {
    path: 'catalogue',
     loadChildren: () => import('./catalogue/catalogue.module').then(m => m.CatalogueModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
