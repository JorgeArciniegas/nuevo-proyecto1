import { Component } from '@angular/core';
import { CouponStatusInternal, CouponTypeInternal } from '../bets-list.model';
import { BetsListService } from '../bets-list.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-summary-coupons',
  templateUrl: './summary-coupons.component.html',
  styleUrls: ['./summary-coupons.component.scss']
})

export class SummaryCouponsComponent {
  couponType: typeof CouponTypeInternal = CouponTypeInternal;
  couponStatus: typeof CouponStatusInternal = CouponStatusInternal;


  constructor(public userService: UserService, public betsListService: BetsListService) { }

  myFilter = (d: Date): boolean => {
    const today = new Date();
    return d.getDate() < today.getDate();
  }

}
