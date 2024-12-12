import { Component } from '@angular/core';
import { CouponStatus, CouponType } from '@elys/elys-api';
import { LICENSE_TYPE } from '../../../../environments/environment.models';
import { AppSettings } from '../../../app.settings';
import { UserService } from '../../../services/user.service';
import { TranslateUtilityService } from '../../../shared/language/translate-utility.service';
import { PrintCouponService } from './print-coupon.service';

@Component({
  selector: 'app-print-coupon',
  templateUrl: './print-coupon.component.html',
  styleUrls: ['./print-coupon.component.scss']
})
export class PrintCouponComponent {
  licenseType: typeof LICENSE_TYPE = LICENSE_TYPE;
  couponType: typeof CouponType = CouponType;
  couponStatus: typeof CouponStatus = CouponStatus;

  maxCombinationBetWin: number;

  get hideMaxPaymentAmount(): boolean {
    return this.appSettings.printSettings.enabledPrintCoupon.hideMaxPaymentAmount;
      
  }

  constructor(
    public printCouponService: PrintCouponService,
    public appSettings: AppSettings,
    public userService: UserService,
    private translateUtilityService: TranslateUtilityService
  ) {
    this.maxCombinationBetWin = userService.limitUser.MaxCombinationBetWin;
  }

  getSelectionName(marketName: string, selectionName: string): string {
    if (marketName.toUpperCase().substring(0, marketName.length - 1) === 'RAINBOW' ||
      marketName.toUpperCase() === 'TOTALCOLOUR') {
      switch (selectionName.substring(0, 1).toLowerCase()) {
        case 'b': return this.translateUtilityService.getTranslatedString('BLUE') + ' ' + selectionName.substring(1);
        case 'r': return this.translateUtilityService.getTranslatedString('RED') + ' ' + selectionName.substring(1);
        case 'g': return this.translateUtilityService.getTranslatedString('GREEN') + ' ' + selectionName.substring(1);
        case 'n': return this.translateUtilityService.getTranslatedString('NO_WINNING_COLOUR') + ' ' + selectionName.substring(1);
        default:
          break;
      }
    }
    return this.translateUtilityService.getTranslatedString(selectionName.toUpperCase());
  }
}
