import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionsListService } from '../transactions-list.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../../../services/user.service';
import { UserTransaction } from '@elys/elys-api';

@Component({
  selector: 'app-details-transaction',
  templateUrl: './details-transaction.component.html',
  styleUrls: ['./details-transaction.component.scss']
})
export class DetailsTransactionComponent implements OnInit, OnDestroy {
  routingSub: Subscription;
  transactionDetails: UserTransaction;

  constructor(public transactionsListService: TransactionsListService, public userService: UserService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.routingSub = this.route.params.subscribe(param => {
      this.transactionDetails = this.transactionsListService.transactionsList.Transactions.filter(
        transaction => transaction.ReferenceId === param.id
      )[0];
    });
  }

  ngOnDestroy(): void {
    this.routingSub.unsubscribe();
  }
}
