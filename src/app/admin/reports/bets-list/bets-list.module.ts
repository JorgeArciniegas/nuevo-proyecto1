import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { BetsListRoutingModule } from './bets-list-routing.module';
import { BetsListComponent } from './bets-list.component';
import { BetsListService } from './bets-list.service';
import { CombinationsComponent } from './details-coupon/combinations/combinations.component';
import { DetailsCouponComponent } from './details-coupon/details-coupon.component';
import { EventsComponent } from './details-coupon/events/events.component';
import { SummaryComponent } from './details-coupon/summary/summary.component';
import { SummaryCouponsComponent } from './summary-coupons/summary-coupons.component';

@NgModule({
  declarations: [
    BetsListComponent,
    DetailsCouponComponent,
    SummaryCouponsComponent,
    CombinationsComponent,
    SummaryComponent,
    EventsComponent
  ],
  imports: [
    CommonModule,
    BetsListRoutingModule,
    SharedModule
  ],
  providers: [BetsListService]
})
export class BetsListModule { }
