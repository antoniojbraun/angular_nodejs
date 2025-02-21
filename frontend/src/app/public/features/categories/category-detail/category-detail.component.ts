import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsListComponent } from '../../posts/posts-list/posts-list.component';
import { CategoryService } from '../../../../core/services/category.service';
import { ICategory } from '../../../../core/interfaces/models/category.model.interface';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [PostsListComponent],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.scss',
})
export class CategoryDetailComponent {
  route = inject(ActivatedRoute);
  categoryService = inject(CategoryService);
  category?: ICategory;

  constructor() {
    this.route.params.subscribe((params) => {
      let categorySlug = params['category'];
      this.loadCategory(categorySlug);
    });
  }

  loadCategory(categorySlug: string) {
    this.categoryService.getCategoryBySlug(categorySlug).subscribe((data) => {
      this.category = data;
    });
  }
}
