import { Injectable } from '@angular/core';
import { CouponPresetValues } from '@elys/elys-api';
import { environment } from '../environments/environment';
import { Products, LICENSE_TYPE, PrintSettings } from '../environments/environment.models';
@Injectable()
export class AppSettings {
  baseApiUrl: string = environment.baseApiUrl;
  bookmakerDetails: string = environment.bookmakerDetails;
  license: LICENSE_TYPE = environment.license;
  production: boolean = environment.production;
  staging: boolean = environment.staging;
  pageTitle: string = environment.pageTitle;
  theme: string = environment.theme;
  faviconPath: string = environment.faviconPath;
  supportedLang: string[] = environment.supportedLang;
  products: Products[] = environment.products;
  printSettings: PrintSettings = environment.printSettings;
  showEventId: boolean = environment.showEventId;
  defaultAmount: CouponPresetValues = environment.defaultAmount;
  couponDirectPlace: boolean = environment.couponDirectPlace;
  currencyDefault: string = environment.currencyDefault;
  loginInteractive: boolean = environment.loginInteractive;
}
