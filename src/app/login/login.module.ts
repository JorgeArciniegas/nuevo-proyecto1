import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { componentDeclarations, routes } from './login.common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [componentDeclarations],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes), MatSlideToggleModule]
})
export class LoginModule { }
