import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperatorSummaryComponent } from './operator-summary.component';
import { OperatorSummaryListComponent } from './operator-summary-list/operator-summary-list.component';


export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: OperatorSummaryComponent
      },
      {
        path: 'operatorSummaryList',
        component: OperatorSummaryListComponent
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperatorSummaryRoutingModule { }
