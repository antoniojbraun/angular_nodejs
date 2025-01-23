import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriesListComponent,
  },
  {
    path: ':category',
    component: CategoryDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesRoutingModule {}
