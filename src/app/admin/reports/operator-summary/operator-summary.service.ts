import { Injectable } from '@angular/core';
import { ElysApiService, ReportsOperatorVolumeRequest, ReportsOperatorVolumeResponse } from '@elys/elys-api';
import { UserService } from '../../../services/user.service';
import { RouterService } from '../../../services/utility/router/router.service';

@Injectable()
export class OperatorSummaryService {
  reportsOperatorVolumeRequest: ReportsOperatorVolumeRequest = null;
  reportsOperatorVolumeResponse: ReportsOperatorVolumeResponse[] = [];
  totalStake = 0;
  totalVoided = 0;
  totalWon = 0;

  /**
   * Filter date
   */
  dateFilterTo = (d: Date): boolean => {
    const today = new Date();
    // return d.getMonth() <= today.getMonth() && d.getDate() <= today.getDate();
    const dateToCompare = (this.reportsOperatorVolumeRequest.dateFrom) ? this.reportsOperatorVolumeRequest.dateFrom : new Date();
    return d >= dateToCompare && d <= today;
  }
  /**
   * IT isn't possible selected the date <>> of the date from
   */
  dateFilterFrom = (d: Date): boolean => {
    // return d <= new Date();
    const dateToCompare = (this.reportsOperatorVolumeRequest.dateTo) ? this.reportsOperatorVolumeRequest.dateTo : new Date();
    return d <= dateToCompare;
  }


  constructor(public elysApi: ElysApiService, private userService: UserService, private router: RouterService) {
    // Request default object.
    this.initResetRequest();
  }

  get dateFrom() {
    return this.reportsOperatorVolumeRequest.dateFrom;
  }

  set dateFrom(date: Date) {
    this.reportsOperatorVolumeRequest.dateFrom = date;
  }

  get dateTo() {
    return this.reportsOperatorVolumeRequest.dateTo;
  }

  set dateTo(date: Date) {
    this.reportsOperatorVolumeRequest.dateTo = date;
    this.reportsOperatorVolumeRequest.dateTo.setHours(23);
    this.reportsOperatorVolumeRequest.dateTo.setMinutes(59);
    this.reportsOperatorVolumeRequest.dateTo.setSeconds(59);
  }

  async getList(): Promise<void> {
    this.resetTotals();
    const req: ReportsOperatorVolumeRequest = this.cloneRequest();
    await this.elysApi.reports.getShopClientsAggregates(req).then(items => (this.reportsOperatorVolumeResponse = items));
    this.reportsOperatorVolumeResponse.map(x => {
      this.totalStake += x.Stake;
      this.totalVoided += x.Voided;
      this.totalWon += x.Won;
    });
    this.router.getRouter().navigateByUrl('admin/reports/operatorSummary/operatorSummaryList');
  }

  // Method to init or reset the request object.
  public initResetRequest(): void {
    const today = new Date();
    this.reportsOperatorVolumeRequest = {
      userId: this.userService.dataUserDetail.userDetail.UserId,
      // Set the date from the begin of the day.
      dateFrom: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0),
      // Set the date to the current time of the day.
      dateTo: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
    };
  }

  private cloneRequest(): ReportsOperatorVolumeRequest {
    return {
      userId: this.userService.dataUserDetail.userDetail.UserId,
      dateFrom: this.reportsOperatorVolumeRequest.dateFrom,
      dateTo: this.reportsOperatorVolumeRequest.dateTo
    };
  }

  private resetTotals(): void {
    this.totalStake = 0;
    this.totalVoided = 0;
    this.totalWon = 0;
  }
}
