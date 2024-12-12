import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BetsListComponent } from './bets-list.component';
import { SummaryCouponsComponent } from './summary-coupons/summary-coupons.component';
import { DetailsCouponComponent } from './details-coupon/details-coupon.component';


export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: BetsListComponent
      },
      {
        path: 'summaryCoupons',
        component: SummaryCouponsComponent
      },
      {
        path: 'detail/:id',
        component: DetailsCouponComponent
      }
    ]
  },
  {
    path: '**',
    loadChildren: () => import('../../../error-page/error-page.module').then(m => m.ErrorPageModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BetsListRoutingModule { }
