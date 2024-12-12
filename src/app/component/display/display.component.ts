import { Component, Input, OnDestroy } from '@angular/core';
import { ElysApiService } from '@elys/elys-api';
import { ElysCouponService } from '@elys/elys-coupon';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { LAYOUT_TYPE } from '../../../environments/environment.models';
import { ColourGameId } from '../../products/main/colour-game.enum';
import { TypeBetSlipColTot } from '../../products/main/main.models';
import { BetDataDialog, PolyfunctionalArea, PolyfunctionalStakeCoupon, PolyfunctionStakePresetPlayer } from '../../products/products.model';
import { ProductsService } from '../../products/products.service';
import { BtncalcService } from '../btncalc/btncalc.service';
import { CouponService } from '../coupon/coupon.service';
import { TranslateUtilityService } from '../../shared/language/translate-utility.service';

@Component({
  selector: 'app-display, [app-display]',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnDestroy {
  @Input()
  public rowHeight: number;
  @Input()
  public timeBlocked = false;
  // Element for management the display
  polyfunctionalValue: PolyfunctionalArea;
  polyfunctionalValueSubscribe: Subscription;
  polyfunctionalStakeCoupon: PolyfunctionalStakeCoupon = new PolyfunctionalStakeCoupon();
  polyfunctionalStakeCouponSubscribe: Subscription;
  polyfunctionStakePresetPlayerSubscribe: Subscription;
  // test amount preset from operator input
  amountPresetPlayer: PolyfunctionStakePresetPlayer;

  // subscribe to changed and placed coupon
  couponHasChangedSubscribe: Subscription;
  couponHasBeenPlaced: Subscription;
  // display from layout's coupon
  typeProductCoupon: typeof LAYOUT_TYPE = LAYOUT_TYPE;
  typeBetSlipColTot: typeof TypeBetSlipColTot = TypeBetSlipColTot;
  colourGameId: typeof ColourGameId = ColourGameId;

  constructor(
    public productService: ProductsService,
    private btnService: BtncalcService,
    public userService: UserService,
    private elysCoupon: ElysCouponService,
    private internalServiceCoupon: CouponService,
    private elysApi: ElysApiService,
    private translateService: TranslateUtilityService
  ) {
    this.amountPresetPlayer = this.btnService.polyfunctionStakePresetPlayer;
    this.polyfunctionalValueSubscribe = this.productService.polyfunctionalAreaObservable.subscribe(element => {
      this.polyfunctionalValue = element;
    });
    // stake coupon change and show to display area
    this.polyfunctionalStakeCouponSubscribe = this.productService.polyfunctionalStakeCouponObs.subscribe(elem => {
      this.polyfunctionalStakeCoupon = elem;
    });

    this.polyfunctionStakePresetPlayerSubscribe = this.btnService.polyfunctionStakePresetPlayerObs.subscribe(
      (item: PolyfunctionStakePresetPlayer) => {
        this.amountPresetPlayer = item;
      }
    );

    this.couponHasChangedSubscribe = this.elysCoupon.couponHasChanged.subscribe(coupon => {
      if (coupon) {
        this.polyfunctionalValue.grouping = coupon.Groupings;
      }
    });

    this.couponHasBeenPlaced = this.internalServiceCoupon.couponHasBeenPlacedObs.subscribe(() => {
      this.polyfunctionalValue.grouping = null;
    });
  }

  ngOnDestroy() {
    this.polyfunctionalValueSubscribe.unsubscribe();
    this.polyfunctionalStakeCouponSubscribe.unsubscribe();
    this.polyfunctionStakePresetPlayerSubscribe.unsubscribe();
    this.couponHasChangedSubscribe.unsubscribe();
    this.couponHasBeenPlaced.unsubscribe();
  }

  detailOdds(isGroupings: boolean = false): void {
    let data: BetDataDialog;
    if (!isGroupings) {
      data = {
        title: this.polyfunctionalValue.selection,
        betOdds: { odds: this.polyfunctionalValue.odds }
      };
    } else {
      data = {
        title: 'GROUPINGS',
        groupings: this.elysCoupon.betCoupon.Groupings
      };
    }
    this.productService.openProductDialog(data);
  }

  async kenoPaytable(): Promise<void> {
    const data: BetDataDialog = {
      title: 'PAYTABLE',
      paytable: {
        codeProduct: this.productService.product.codeProduct,
        payouts: await this.elysApi.virtual.getPayouts(),
        layoutProducts: this.productService.product.layoutProducts.type,
        selectionNumber: this.polyfunctionalValue.oddsCounter
      }
    };
    this.productService.openProductDialog(data);
  }

  async coloursPaytable(): Promise<void> {
    const data: BetDataDialog = {
      title: 'PAYTABLE',
      paytable: {
        codeProduct: this.productService.product.codeProduct,
        payouts: await this.elysApi.virtual.getColoursPayouts(),
        layoutProducts: this.productService.product.layoutProducts.type,
        selectionNumber: this.polyfunctionalValue.oddsCounter,
        selectionString: this.polyfunctionalValue.odds[0].label,
        market: this.polyfunctionalValue.selection
      }
    };
    this.productService.openProductDialog(data);
  }

  isColoursPaytableAvailable(): boolean {
    if (this.polyfunctionalValue.selection === ColourGameId[ColourGameId.dragon]) {
      if ((this.polyfunctionalValue.oddsCounter >= 6 && this.polyfunctionalValue.oddsCounter <= 10) ||
        this.polyfunctionalValue.oddsCounter === 15) {
        return true;
      }
      return false;
    }
    return true;
  }

  getDisplaySelection(): string {
    if (this.polyfunctionalValue.selection === ColourGameId[ColourGameId.rainbow] ||
      this.polyfunctionalValue.selection === ColourGameId[ColourGameId.totalcolour]) {
      let returnValue: string;
      if (this.polyfunctionalValue.odds[0]) {
        switch (this.polyfunctionalValue.odds[0].label.substring(0, 1).toLowerCase()) {
          case 'b': returnValue = this.translateService.getTranslatedString('BLUE'); break;
          case 'r': returnValue = this.translateService.getTranslatedString('RED'); break;
          case 'g': returnValue = this.translateService.getTranslatedString('GREEN'); break;
          case 'n': returnValue = this.translateService.getTranslatedString('NO_WINNING_COLOUR'); break;
          default:
            break;
        }
      }
      returnValue += ' ' + this.polyfunctionalValue.odds[0].label.substring(1);
      if (this.polyfunctionalValue.odds[0].label.substring(1) !== '0' &&
        this.polyfunctionalValue.odds[0].label.substring(1) !== '6' &&
        this.polyfunctionalValue.selection !== ColourGameId[ColourGameId.totalcolour]) {
        return returnValue + '+';
      }
      return returnValue;
    }
    return this.translateService.getTranslatedString(this.polyfunctionalValue.odds[0].label);
  }


  getRouletteValue(): string {
    const tmp = [];
    this.polyfunctionalValue.odds.forEach(item => {
      switch (item.label.trim()) {
        case 'LOW': item.label = 'AMERICANROULETTE.LOW'; break;
        case 'HIGH': item.label = 'AMERICANROULETTE.HIGH'; break;
        case '1-12': item.label = 'AMERICANROULETTE.1DOZEN'; break;
        case '13 - 24': item.label = 'AMERICANROULETTE.2DOZEN'; break;
        case '25 - 36': item.label = 'AMERICANROULETTE.3DOZEN'; break;
        default:
          item.label = item.label.toUpperCase();
          break;
      }
      tmp.push(this.translateService.getTranslatedString(item.label).toUpperCase());
    });
    let res = '';
    tmp.reverse();
    if (tmp.length > 7) {
      res = '...';
    }
    tmp.forEach((i, idx) => {
      if (idx < 8) {
        if (res.length > 0) {
          res += ',';
        }
        res += i;
      } else {
        return;
      }
    });
    return res;
  }
}
