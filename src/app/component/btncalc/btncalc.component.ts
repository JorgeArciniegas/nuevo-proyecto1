import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { UserService } from '../../../../src/app/services/user.service';
import { AppSettings } from '../../app.settings';
import { ProductsService } from '../../products/products.service';
import { CouponService } from '../coupon/coupon.service';
import { BtncalcComponentCommon } from './btncalc.component.common';
import { BtncalcService } from './btncalc.service';

@Component({
  selector: 'app-btncalc',
  templateUrl: './btncalc.component.html',
  styleUrls: ['./btncalc.component.scss']
})
export class BtncalcComponent extends BtncalcComponentCommon
  implements OnInit, OnDestroy {
  @Input()
  rowHeight: number;
  // Doublie click event on button CANCEL
  clickTimerSubscription: Subscription;
  preventClick: boolean = false;
  constructor(
    productService: ProductsService,
    btncalcService: BtncalcService,
    public appSetting: AppSettings,
    couponService: CouponService,
    userService: UserService
  ) {
    super(
      productService,
      btncalcService,
      appSetting,
      couponService,
      userService
    );
  }

  ngOnInit(): void {
    this.btncalcService.initializeSubscriptionAndData();
  }

  ngOnDestroy(): void {
    this.polyfunctionalValueSubscribe.unsubscribe();
    this.CouponoddStakeEditObs.unsubscribe();
    this.couponResponseSubs.unsubscribe();
    if (this.clickTimerSubscription) {
      this.clickTimerSubscription.unsubscribe();
    }
  }

  /**
   * DOUBLE CLICK TO BUTTON CANCEL
   * some version google chrome don't support the dom event dblclick
   */
  onClickCancelButton() {
    if (this.preventClick) {
      this.clearAll();
      this.preventClick = false;

    } else {
      this.preventClick = true;
      this.clickTimerSubscription = timer(500).subscribe(() => {
        this.polyfuncionalAmountReset();
        this.preventClick = false;
      });

    }

  }

}
