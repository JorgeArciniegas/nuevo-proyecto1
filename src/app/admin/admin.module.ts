import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { componentDeclarations, routes } from './admin.common';
import { OperatorsService } from './settings/operators/operators.service';

@NgModule({
  declarations: [componentDeclarations],
  imports: [CommonModule, SharedModule, MatDatepickerModule, MatInputModule, MatNativeDateModule, RouterModule.forChild(routes)],
  exports: [MatDatepickerModule, MatInputModule, MatNativeDateModule],
  providers: [OperatorsService]
})
export class AdminModule { }
