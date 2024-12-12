import { Injectable } from '@angular/core';
import { ElysApiService, ReportsCtdAggregatesRequest, ReportsCtdAggregatesResponse } from '@elys/elys-api';
import { timer } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { ExcelService } from '../../../services/utility/export/excel.service';
import { DataListOfCtdAggregate } from './statement-virtual-shop.model';


@Injectable()
export class StatementVirtualShopService {

  request: ReportsCtdAggregatesRequest = null;
  aggregatesData: DataListOfCtdAggregate = new DataListOfCtdAggregate();
  aggregatesTempData: ReportsCtdAggregatesResponse[] = [];

  // counter for max row per page
  rowNumber = 10;

  /**
   * Filter date
   */
  dateFilterTo = (d: Date): boolean => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return d <= today;
  }
  /**
   * IT isn't possible selected the date <>> of the date from
   */
  dateFilterFrom = (d: Date): boolean => {
    // return d <= new Date();
    const dateToCompare = (this.request.ToDate) ? this.request.ToDate : new Date();
    return d <= dateToCompare;
  }


  constructor(
    private userService: UserService,
    private elysApi: ElysApiService,
    private exportService: ExcelService
  ) {
    if (this.userService.dataUserDetail.userDetail === null) {
      timer(1000).subscribe(() => this.initData());
    } else {
      this.initData();
    }

  }

  /**
   * GETTER AND SETTER REQUEST'S PARAMETERS
   */
  get UserId() {
    return this.request.UserId;
  }

  set UserId(userId: number) {
    this.request.UserId = userId;
  }
  get dateFrom() {
    return this.request.FromDate;
  }

  set dateFrom(date: Date) {
    this.request.FromDate = date;
  }

  get dateTo() {
    return this.request.ToDate;
  }

  set dateTo(date: Date) {
    this.request.ToDate = date;
    this.request.ToDate.setHours(23);
    this.request.ToDate.setMinutes(59);
    this.request.ToDate.setSeconds(59);
  }


  /**
   * Set the default value
   */
  initData(): void {
    try {
      const today = new Date();
      this.request = {
        UserId: this.userService.dataUserDetail.userDetail.UserId,
        // Set the date from the begin of the day.
        FromDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 0, 0, 0),
        // Set the date at the 23:59:59 to the current day.
        ToDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 23, 59, 59)
      };
    } catch (err) {
      console.error(err);
    }
  }

  /**
   *
   */
  getData(): void {
    this.elysApi.reports.getCtdAggregates(this.request).then(
      (items) => {
        this.aggregatesData = new DataListOfCtdAggregate();
        this.aggregatesTempData = [];
        if (items.length > 0) {
          // create a new aggregates object
          this.aggregatesData.aggregates = items;
          // generate the totals
          items.map(item => {
            this.aggregatesData.totals.Stake += item.Stake || 0;
            this.aggregatesData.totals.Won += item.Won || 0;
            this.aggregatesData.totals.MegaJackpot += item.MegaJackpot || 0;
            this.aggregatesData.totals.NumberOfCoupons += item.NumberOfCoupons || 0;
            this.aggregatesData.totals.ShopJackpot += item.ShopJackpot || 0;
            this.aggregatesData.totals.TotalProfit += item.Profit || 0;
          });

        }
        this.pagination();
      }
    );
  }

  /**
   * Paginator
   * It define the paginator
   */
  private pagination(): void {
    if (this.aggregatesData.aggregates.length > 0) {
      this.aggregatesData.totalPages = (this.aggregatesData.aggregates.length > 0)
        ? Math.ceil(this.aggregatesData.aggregates.length / this.rowNumber) : 0;

      if (this.aggregatesData.actualPages === 0 && this.aggregatesData.totalPages > 0) {
        this.aggregatesData.actualPages = 1;
      }

      this.filterOperators();
    }
  }

  /**
   * Filter and paginate the list of operators
   */
  filterOperators(): void {
    const start = (this.aggregatesData.actualPages - 1) * this.rowNumber;
    let end = (this.aggregatesData.actualPages) * this.rowNumber;
    if (end > this.aggregatesData.aggregates.length) {
      end = this.aggregatesData.aggregates.length;
    }
    // save the object temp for pagination
    this.aggregatesTempData = this.aggregatesData.aggregates.slice(start, end);

  }

  /**
   * Export the data aggregates to excel "XLSX"
   */

  exportData(): void {
    if (this.aggregatesData.aggregates.length > 0) {
      this.exportService.exportAsExcelFile(this.aggregatesData.aggregates, 'STATEMENT_SHOP');
    }
  }


}
