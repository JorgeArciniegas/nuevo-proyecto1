import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionsListComponent } from './transactions-list.component';
import { SummaryTransactionsComponent } from './summary-transactions/summary-transactions.component';
import { DetailsTransactionComponent } from './details-transaction/details-transaction.component';


export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TransactionsListComponent
      },
      {
        path: 'summaryTransactions',
        component: SummaryTransactionsComponent
      },
      {
        path: 'detail/:id',
        component: DetailsTransactionComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsListRoutingModule { }
