import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes, componentDeclarations } from './error-page.common';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [componentDeclarations],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)]
})
export class ErrorPageModule { }
