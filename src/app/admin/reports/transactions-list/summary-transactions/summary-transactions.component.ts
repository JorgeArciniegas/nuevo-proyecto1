import { Component } from '@angular/core';
import { TransactionCategory } from '../transactions-list.model';
import { TransactionsListService } from '../transactions-list.service';
import { UserService } from '../../../../services/user.service';


@Component({
  selector: 'app-summary-transactions',
  templateUrl: './summary-transactions.component.html',
  styleUrls: ['./summary-transactions.component.scss']
})
export class SummaryTransactionsComponent {
  object = Object;
  transactionType: typeof TransactionCategory = TransactionCategory;

  constructor(public userService: UserService, public transactionsListService: TransactionsListService) { }

  /**
   *  @param income credit
   *  @param income debit
   *  Return profit
   */
  totalBalance(income: number, outcome: number): number {
    //Math.abs to convert to a positive number
    return income - Math.abs(outcome);
  }
}
