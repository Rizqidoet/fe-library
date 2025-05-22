import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogueListComponent } from './components/list/catalogue-list.component';
import { CatalogueFormComponent } from './components/form/catalogue-form.component';

const routes: Routes = [
  {
      path: '',
      component: CatalogueListComponent,
    },
    {
      path: 'form',
      component: CatalogueFormComponent,
    },
    {
      path: 'form/:id',
      component: CatalogueFormComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogueRoutingModule { }
