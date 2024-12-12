import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CouponCategory, ElysApiService, SummaryCoupon, SummaryCouponRequest } from '@elys/elys-api';
import { Subscription } from 'rxjs';
import { AppSettings } from '../../../../../../src/app/app.settings';
import { ShowBetDetailView } from '../bets-list.model';
import { GroupingsRows, OddsEventRows } from './detail-coupon.model';
import { PrintCouponService } from '../../../../../../src/app/component/coupon/print-coupon/print-coupon.service';

@Component({
  selector: 'app-details-coupon',
  templateUrl: './details-coupon.component.html',
  styleUrls: ['./details-coupon.component.scss']
})
export class DetailsCouponComponent implements OnInit, OnDestroy {
  private definedNumberRowForEvents = 3;
  private definedNumberRowForGroupings = 5;
  routingSub: Subscription;
  couponDetail: SummaryCoupon;
  showDataViewSelected: ShowBetDetailView;
  showBetDetailView: typeof ShowBetDetailView = ShowBetDetailView;

  couponOddEvent: OddsEventRows;
  couponGroupingsRow: GroupingsRows;
  constructor(
     private route: ActivatedRoute,
     private elysApi: ElysApiService,
     public readonly settings: AppSettings,
     private printService: PrintCouponService
     ) {
      this.showDataViewSelected = ShowBetDetailView.SUMMARY;
     }

  ngOnInit() {
    this.routingSub = this.route.params.subscribe( params => {
      const req: SummaryCouponRequest = {
        CouponCategory: CouponCategory.Virtual,
        IdOrCode:  params.id
      };
      this.elysApi.coupon.getCouponDetail(req).then( items => {
        this.couponDetail = items;
        // setting paginator for events
        this.couponOddEvent = {
          couponStatus: this.couponDetail.CouponStatusId,
          pageOdd: 1,
          pageOddRows: this.definedNumberRowForEvents,
          maxPage: this.couponDetail.Odds.length === 1 ? 1 : Math.ceil(this.couponDetail.Odds.length / this.definedNumberRowForEvents),
          
          odd: this.couponDetail.Odds.slice(0, this.definedNumberRowForEvents )
        };
        // setting paginator for combinations
        this.couponGroupingsRow = {
          groupings: this.couponDetail.Groupings,
          pageGrouping: 1,
          pageGroupingRows: this.definedNumberRowForGroupings,
          maxPage: this.couponDetail.Groupings.length === 1 ?
            1 : Math.ceil(this.couponDetail.Groupings.length / this.definedNumberRowForGroupings),
          couponStake: this.couponDetail.Stake
        };
      });
   });
  }

  changePage(page: boolean): void {
    // manage events tab paging
    if (this.showDataViewSelected === ShowBetDetailView.EVENTS) {
      if(page) {
        // increase page index
        if(this.couponOddEvent.pageOdd <= this.couponOddEvent.maxPage) {
          ++this.couponOddEvent.pageOdd;
        }
      } else {
        // decrease page index
        if(this.couponOddEvent.pageOdd > 0) {
          --this.couponOddEvent.pageOdd;
        }
      }
      // slice coupon odds according to the selected page
      this.couponOddEvent.odd = this.couponDetail.Odds.slice(
        this.couponOddEvent.pageOdd === 1 ? 0 : (this.couponOddEvent.pageOdd - 1) * this.definedNumberRowForEvents,
        ((this.couponOddEvent.pageOdd - 1) * this.definedNumberRowForEvents) + this.definedNumberRowForEvents);
    }

    // Manage events tab paging
    if (this.showDataViewSelected === ShowBetDetailView.COMBINATIONS) {
      if(page) {
        // Increase page index
        if(this.couponGroupingsRow.pageGrouping <= this.couponOddEvent.maxPage) {
          ++this.couponGroupingsRow.pageGrouping;
        }
      } else {
        // Decrease page index
        if(this.couponGroupingsRow.pageGrouping > 0) {
          --this.couponGroupingsRow.pageGrouping;
        }
      }
      // slice coupon groupings according to the selected page
      this.couponGroupingsRow.groupings = this.couponDetail.Groupings.slice(
        this.couponGroupingsRow.pageGrouping === 1 ? 0 : (this.couponGroupingsRow.pageGrouping - 1) * this.definedNumberRowForGroupings,
        ((this.couponGroupingsRow.pageGrouping - 1) * this.definedNumberRowForGroupings) + this.definedNumberRowForGroupings);
    }
  }

  ngOnDestroy() {
    this.routingSub.unsubscribe();
  }

  changeView(view:  ShowBetDetailView): void  {
    this.showDataViewSelected = view;
  }

  printAgainCoupon( ): void {
    this.printService.reprintCoupon( this.couponDetail );
  }

}
