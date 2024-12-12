import { Routes } from '@angular/router';
import { PrintOperatorSummaryComponent } from './admin/reports/operator-summary/operator-summary-list/print-operator-summary/print-operator-summary.component';
import { AuthorizationGuard } from './app.authorization.guard';
import { PrintReceiptComponent } from './component/coupon/pay-cancel-dialog/print-receipt/print-receipt.component';
import { PrintCouponComponent } from './component/coupon/print-coupon/print-coupon.component';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
    canActivate: [AuthorizationGuard]
  },
  /**
     * Routing used without login interactive
  */
  {
    path: 'extclient/:token/:language/:homeURL/:loginType',
    loadChildren: () => import('./extclient/extclient.module').then(m => m.ExtclientModule),
    canActivate: [AuthorizationGuard]
  },
  {
    path: 'print-coupon',
    component: PrintCouponComponent,
    outlet: 'print'
  },
  {
    path: 'print-receipt',
    component: PrintReceiptComponent,
    outlet: 'print'
  },
  {
    path: 'print-operator-summary',
    component: PrintOperatorSummaryComponent,
    outlet: 'print'
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule),
    canActivate: [AuthorizationGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthorizationGuard]
  },
  {
    path: 'error-page',
    loadChildren: () => import('./error-page/error-page.module').then(m => m.ErrorPageModule),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'error-page'
    // loadChildren: () => import('./error-page/error-page.module').then(m => m.ErrorPageModule),
  }
];

