import { Injectable } from '@angular/core';
import { ElysApiService, ReportsAccountStatementRequest, ReportsAccountStatementResponse } from '@elys/elys-api';
import { RouterService } from '../../../services/utility/router/router.service';
import { TransactionCategory } from './transactions-list.model';

@Injectable()
export class TransactionsListService {
  request: ReportsAccountStatementRequest = null;
  pageSizeList: number[] = [10, 25, 50];
  sportIdSelected: number;
  // Result of request list
  transactionsList: ReportsAccountStatementResponse = null;


  /**
   * Filter date
   */
  dateFilterTo = (d: Date): boolean => {
    const today = new Date();
    // return d.getMonth() <= today.getMonth() && d.getDate() <= today.getDate();
    const dateToCompare = (this.request.dateFrom) ? this.request.dateFrom : new Date();
    return d >= dateToCompare && d <= today;
  }
  /**
   * IT isn't possible selected the date <>> of the date from
   */
  dateFilterFrom = (d: Date): boolean => {
    // return d <= new Date();
    const dateToCompare = (this.request.dateTo) ? this.request.dateTo : new Date();
    return d <= dateToCompare;
  }

  constructor(public elysApi: ElysApiService, private router: RouterService) {
    // Request default object.
    this.initResetRequest();
  }

  // Getter and setter object property.
  get transactionTypesCsv(): TransactionCategory {
    return this.request.transactionTypesCsv as TransactionCategory;
  }

  set transactionTypesCsv(type: TransactionCategory) {
    this.request.transactionTypesCsv = type;
  }

  get dateFrom() {
    return this.request.dateFrom;
  }

  set dateFrom(date: Date) {
    this.request.dateFrom = date;
  }

  get dateTo() {
    return this.request.dateTo;
  }

  set dateTo(date: Date) {
    this.request.dateTo = date;
    this.request.dateTo.setHours(23);
    this.request.dateTo.setMinutes(59);
    this.request.dateTo.setSeconds(59);
  }

  get amountFrom() {
    return this.request.amountFrom;
  }

  set amountFrom(amount: number) {
    this.request.amountFrom = amount;
  }

  get amountTo() {
    return this.request.amountTo;
  }

  set amountTo(amount: number) {
    this.request.amountTo = amount;
  }

  get service() {
    return this.request.service;
  }

  set service(service: string) {
    this.request.service = service;
  }

  get pageSize() {
    return this.request.pageSize;
  }

  set pageSize(page: number) {
    this.request.pageSize = page;
  }

  get requestedPage() {
    return this.request.requestedPage;
  }

  set requestedPage(page: number) {
    this.request.requestedPage = page;
  }

  get userWalletType() {
    return this.request.userWalletType;
  }

  set userWalletType(userWalletType: number) {
    this.request.userWalletType = userWalletType;
  }

  /**
   * Paginator called from Summary Coupons
   * @param isIncrement
   */
  paginatorSize(isIncrement: boolean): void {
    let updateTransactionsList = false;
    if (this.request.requestedPage > 0 && !isIncrement) {
      this.request.requestedPage--;
      updateTransactionsList = true;
    } else if (isIncrement) {
      if (this.request.requestedPage < this.transactionsList.TotalPages) {
        this.request.requestedPage++;
        updateTransactionsList = true;
      }
    }

    if (updateTransactionsList) {
      this.getList();
    }
  }

  getList(reset?: boolean): void {
    if (reset) {
      this.request.requestedPage = 0;
    }
    const req: ReportsAccountStatementRequest = this.cloneRequest();
    this.elysApi.reports.getTransactionsHistory(req).then(items => {
      this.transactionsList = items;
      if (this.request.requestedPage === 0 && items.TotalPages > 0) {
        this.request.requestedPage = 1;
      }
    });
    // this.initResetRequest();
    this.router.getRouter().navigateByUrl('admin/reports/transactionsList/summaryTransactions');
  }

  // Method to init or reset the request object.
  private initResetRequest(): void {
    const today = new Date();
    this.request = {
      transactionTypesCsv: TransactionCategory.ALL,
      // Set the date from the begin of the day.
      dateFrom: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0),
      // Set the date to the current time of the day.
      dateTo: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      amountFrom: undefined,
      amountTo: undefined,
      service: '',
      pageSize: this.pageSizeList[0],
      requestedPage: 0,
      userWalletType: null
    };
  }

  private cloneRequest(): ReportsAccountStatementRequest {

    return {
      transactionTypesCsv: this.request.transactionTypesCsv,
      dateFrom: this.request.dateFrom,
      dateTo: this.request.dateTo,
      amountFrom: this.request.amountFrom,
      amountTo: this.request.amountTo,
      service: this.request.service,
      pageSize: this.request.pageSize,
      requestedPage: (this.request.requestedPage === 0) ? 1 : this.request.requestedPage,
      userWalletType: this.request.userWalletType
    };
  }
}
