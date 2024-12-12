import { Component, OnInit, Input } from '@angular/core';
import { SummaryCoupon, CouponStatus, CouponType } from '@elys/elys-api';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  @Input() data: SummaryCoupon;

  couponType: typeof CouponType = CouponType;
  couponStatus: typeof CouponStatus = CouponStatus;

  constructor(public userService: UserService) {}
}
