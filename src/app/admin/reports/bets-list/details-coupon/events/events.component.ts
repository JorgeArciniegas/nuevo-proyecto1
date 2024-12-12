import { Component, Input, OnInit } from '@angular/core';
import { CouponStatus } from '@elys/elys-api';
import { OddsEventRows } from '../detail-coupon.model';
import { UserService } from '../../../../../../../src/app/services/user.service';
import { OddResult } from '../../bets-list.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {
  @Input() data: OddsEventRows;
  couponStatus: typeof CouponStatus = CouponStatus;
  oddResult: typeof OddResult = OddResult;
  constructor(public userService: UserService) {}
}
