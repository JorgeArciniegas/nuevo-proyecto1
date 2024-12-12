import { Injectable } from '@angular/core';
import {
  AccountVirtualSport,
  CouponSummaryCouponListResponse,
  CouponType,
  ElysApiService,
  VirtualCouponListByAgentRequest,
  AccountOperator
} from '@elys/elys-api';
import { UserService } from '../../../services/user.service';
import { AppSettings } from '../../../app.settings';
import { RouterService } from '../../../services/utility/router/router.service';
import { CouponStatusInternal, CouponTypeInternal } from './bets-list.model';

@Injectable()
export class BetsListService {
  request: VirtualCouponListByAgentRequest = null;
  availableSport: AccountVirtualSport[] = [];
  pageSizeList: number[] = [10, 25, 50, 100];
  labelAvailableSportSelected: string;
  sportIdSelected: number;
  // Result of request list
  betsCouponList: CouponSummaryCouponListResponse = null;

  operatorSelected: AccountOperator;


  /**
   * Filter date
   */
  dateFilterTo = (d: Date): boolean => {
    const today = new Date();
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


  constructor(
    public elysApi: ElysApiService,
    private router: RouterService,
    private appSettings: AppSettings,
    private userService: UserService
  ) {
    // first element of ALL Sport
    this.availableSport[0] = {
      SportId: 0,
      SportName: 'ALL',
      VirtualCategories: []
    };

    this.getAvailableSport();

    /**
     * Request default object
     */

    // check a userid by different logged type user

    this.request = {
      couponStatus: CouponStatusInternal.ALL,
      dateFrom: new Date(),
      dateTo: new Date(),
      pageSize: this.pageSizeList[0],
      requestedPage: 0,
      couponType: CouponTypeInternal.ALL,
      sportId: null,
      product: null,
      complianceCode: '',
      ticketCode: '',
      dateHasPlaced: false,
      includeAllTheNetwork: false,
      userId: 0,
      idAgentClient: 0,
      carriedOut: false
    };
    this.operatorSelected = null;
    this.sportId = this.availableSport[0].SportId;
    const today = new Date();
    this.dateFrom = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    this.dateTo = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }


  /**
   * GETTER AND SETTER OBJECT PROPERTY
   */

  get dateHasPlaced(): boolean {
    return this.request.dateHasPlaced;
  }
  set dateHasPlaced(value: boolean) {
    this.request.dateHasPlaced = value;
  }

  get carriedOut(): boolean {
    return this.request.carriedOut;
  }
  set carriedOut(value: boolean) {
    this.request.carriedOut = value;
  }

  get couponStatus() {
    return this.request.couponStatus;
  }

  set couponStatus(status: CouponStatusInternal) {
    this.request.couponStatus = status;
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
    // set dateTo to get a day worth of data if it's the same as dateFrom
    date.setHours(date.getHours() + 23 );
    date.setMinutes(date.getMinutes() + 59 );
    date.setSeconds(date.getSeconds() + 59 );
    date.setMilliseconds(date.getMilliseconds() + 99 );
    this.request.dateTo = date;
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

  get couponType() {
    return this.request.couponType;
  }

  set couponType(type: CouponType) {
    this.request.couponType = type;
  }

  get sportId() {
    return this.request.sportId;
  }

  set sportId(sportId: number) {
    if (sportId !== null) {
      this.sportIdSelected = sportId;
      this.request.sportId = sportId;
      this.labelAvailableSportSelected = this.availableSport.filter(
        item => item.SportId === this.request.sportId
      )[0].SportName;
    }
  }

  get ticketCode() {
    return this.request.ticketCode || null;
  }

  set ticketCode(ticketCode: string) {
    this.request.ticketCode = ticketCode;
  }

  get complianceCode() {
    return this.request.complianceCode || null;
  }

  set complianceCode(complianceCode: string) {
    this.request.complianceCode = complianceCode;
  }

  get idAgentClient() {
    return this.request.idAgentClient || 0;
  }

  set idAgentClient(idAgentClient: number) {
    this.request.idAgentClient = idAgentClient;
  }

  /**
   * getAvailableSport
   * set on the betlists the new  availableSport object
   * it doesn't accept the duplicate sportId
   *
   */
  getAvailableSport(): void {
    const tempKey = [];
    this.appSettings.products.map((item) => {
      // check if the sportId is already exist
      if (tempKey.includes(item.sportId)) {
        return;
      }
      // put on the availableSport
      this.availableSport.push({
        SportId: item.sportId,
        SportName: item.name,
        VirtualCategories: []
      });
      // update the checkArray with sportId
      tempKey.push(item.sportId);
    });
  }

  /**
   * Paginator called from Summary Coupons
   * @param isIncrement
   */
  paginatorSize(isIncrement: boolean): void {
    let updateBetList = false;
    if (this.request.requestedPage > 0 && !isIncrement) {
      this.request.requestedPage--;
      updateBetList = true;
    } else if (isIncrement) {
      if (this.request.requestedPage < this.betsCouponList.TotalPages) {
        this.request.requestedPage++;
        updateBetList = true;
      }
    }

    if (updateBetList) {
      this.getList();
    }
  }

  getList(reset?: boolean): void {
    if (reset) {
      this.request.requestedPage = 0;
    }
    const req: VirtualCouponListByAgentRequest = this.cloneRequest();

    this.elysApi.reports
      .getVirtualListOfCouponByAgent(req)
      .then(items => {
        this.betsCouponList = items;
        if (this.request.requestedPage === 0 && items.TotalPages > 0) {
          this.request.requestedPage = 1;
        }
      });

    this.router
      .getRouter()
      .navigateByUrl('admin/reports/betsList/summaryCoupons');
  }


  private cloneRequest(): VirtualCouponListByAgentRequest {

    let tmpUserId = this.request.userId;
    if (tmpUserId === 0) {
      tmpUserId = (!this.userService.isLoggedOperator()) ?
        this.userService.dataUserDetail.operatorDetail.UserId :
        this.userService.dataUserDetail.userDetail.UserId;
    }
    return {
      couponStatus: this.request.couponStatus,
      dateFrom: this.request.dateFrom,
      dateTo: this.request.dateTo,
      pageSize: this.request.pageSize,
      requestedPage: (this.request.requestedPage === 0) ? 1 : this.request.requestedPage,
      couponType: this.request.couponType,
      sportId: this.request.sportId === 0 ? null : this.request.sportId,
      product: this.request.product,
      complianceCode: this.request.complianceCode,
      ticketCode: this.request.ticketCode.replace(/[^a-zA-Z0-9\-]/g, '-'),
      dateHasPlaced: this.request.dateHasPlaced,
      carriedOut: this.carriedOut,
      userId: tmpUserId,
      idAgentClient: this.request.idAgentClient,
      includeAllTheNetwork: this.request.includeAllTheNetwork
    };
  }
}
