import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { PrintOperatorSummaryComponent } from './admin/reports/operator-summary/operator-summary-list/print-operator-summary/print-operator-summary.component';
import { AppComponent } from './app.component';
import { AppHttpInterceptor } from './app.httpinterceptor';
import { AppSettings } from './app.settings';
import { BtncalcService } from './component/btncalc/btncalc.service';
import { CouponService } from './component/coupon/coupon.service';
import { PrintReceiptComponent } from './component/coupon/pay-cancel-dialog/print-receipt/print-receipt.component';
import { PrintCouponComponent } from './component/coupon/print-coupon/print-coupon.component';
import { ApplicationMenuComponent } from './component/header/application-menu/application-menu.component';
import { HeaderComponent } from './component/header/header.component';
import { UserMenuComponent } from './component/header/user-menu/user-menu.component';
import { LoaderComponent } from './component/loader/loader.component';

export const componentDeclarations: any[] = [
  AppComponent,
  HeaderComponent,
  UserMenuComponent,
  ApplicationMenuComponent,
  PrintCouponComponent,
  PrintReceiptComponent,
  PrintOperatorSummaryComponent,
  LoaderComponent,
];

export const providerDeclarations: any[] = [
  AppSettings,
  TranslateService,
  { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
  CouponService,
  BtncalcService,
];
