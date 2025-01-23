import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsRoutingModule } from './posts-routing.module';
import { PostEditorComponent } from './post-editor/post-editor.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PostsRoutingModule
  ]
})
export class PostsModule { }
