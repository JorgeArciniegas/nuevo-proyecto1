import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OperatorSummaryRoutingModule } from './operator-summary-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { OperatorSummaryComponent } from './operator-summary.component';
import { OperatorSummaryListComponent } from './operator-summary-list/operator-summary-list.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { OperatorSummaryService } from './operator-summary.service';



@NgModule({
  declarations: [OperatorSummaryComponent, OperatorSummaryListComponent],
  imports: [
    CommonModule,
    SharedModule,
    OperatorSummaryRoutingModule,
    MatDatepickerModule, MatInputModule, MatNativeDateModule
  ],
  providers: [OperatorSummaryService]
})
export class OperatorSummaryModule { }
