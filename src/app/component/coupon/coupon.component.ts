import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { BetCouponOdd, CouponType } from '@elys/elys-api';
import { BetCouponOddExtended } from '@elys/elys-coupon/lib/elys-coupon.models';
import { Subscription } from 'rxjs';
import { LAYOUT_TYPE, TypeCoupon } from '../../../../src/environments/environment.models';
import { AppSettings } from '../../app.settings';
import { ColourGameId } from '../../products/main/colour-game.enum';
import { AmericanRouletteRug } from '../../products/main/playable-board/templates/american-roulette/american-roulette.models';
import { Colour } from '../../products/main/playable-board/templates/colours/colours.models';
import { BetOdd, Market, PolyfunctionalArea } from '../../products/products.model';
import { ProductsService } from '../../products/products.service';
import { UserService } from '../../services/user.service';
import { TranslateUtilityService } from '../../shared/language/translate-utility.service';
import { WindowSizeService } from '../../services/utility/window-size/window-size.service';
import { CouponService } from './coupon.service';
import { PlaySource } from '@elys/elys-api';
@Component({
  selector: 'app-coupon, [app-coupon]',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements AfterViewInit, OnDestroy {
  @Input()
  public rowHeight: number;
  @Input()
  public timeBlocked: boolean;
  public maxItems = 5;
  public page = 0;
  public maxPage = 0;
  public listOdds: BetCouponOddExtended[] = [];
  private remove = false;
  Math = Math;
  @ViewChild('logoForPrint', {static: true}) private logoForPrint: ElementRef;
  // number of odds inserted to coupon
  private couponServiceSubscription: Subscription;
  
  // Type coupon
  public get couponLayout(): TypeCoupon {
    return this.productService.product.typeCoupon;
  }

  layoutProduct: typeof LAYOUT_TYPE = LAYOUT_TYPE;
  couponTypeId: typeof CouponType = CouponType;
  colourGameId: typeof ColourGameId = ColourGameId;

  public market: typeof Market = Market;
  public playSource: typeof PlaySource = PlaySource;

  constructor(
    public couponService: CouponService,
    public readonly settings: AppSettings,
    public productService: ProductsService,
    public userService: UserService,
    public windowSizeService: WindowSizeService,
    private translateService: TranslateUtilityService,
  ) {
    if (this.windowSizeService.windowSize.small) {
      this.maxItems = 4;
    }

    this.couponServiceSubscription = this.couponService.couponResponse.subscribe(coupon => {
      if (coupon === null) {
        return;
      }
      if (coupon.internal_isLottery) {
        this.maxItems = 10;
        const polyFunc: PolyfunctionalArea = this.productService.polyfunctionalAreaSubject.getValue();
        polyFunc.oddsCounter = coupon.Odds.length;
      } else if (coupon.internal_isColours) {
        this.maxItems = 15;
        const polyFunc: PolyfunctionalArea = this.productService.polyfunctionalAreaSubject.getValue();
        polyFunc.oddsCounter = coupon.Odds.length;
      } else {
        this.maxItems = this.windowSizeService.windowSize.small ? 4 : 5;
      }
      this.maxPage = Math.ceil(coupon.Odds.length / this.maxItems);
      if (!this.remove) {
        this.page = 0;
      } else {
        this.remove = false;
      }
      this.filterOdds();
    });
  }
  ngAfterViewInit(): void {
    if(this.logoForPrint){
      this.logoForPrint.nativeElement.classList.add('noshow');
    }
  }

  filterOdds(): void {
    let index = 0;
    const end: number = this.couponService.coupon.Odds.length - this.page * this.maxItems;
    const start: number = this.couponService.coupon.Odds.length - (this.page + 1) * this.maxItems;

    this.listOdds = this.couponService.coupon.Odds.filter(() => {
      index++;
      return index > start && index <= end;
    }).reverse();
  }

  previusOdds(): void {
    if (this.page <= 0) {
      return;
    }
    this.page--;
    this.filterOdds();
  }

  nextOdds(): void {
    if (this.page >= this.maxPage - 1) {
      return;
    }
    this.page++;
    this.filterOdds();
  }

  removeOdd(odd: BetCouponOddExtended): void {
    this.remove = true;
    this.couponService.addRemoveToCoupon([new BetOdd(odd.SelectionName, odd.OddValue, odd.OddStake, odd.SelectionId)]);
  }

  removeOddByLottery(odd: BetCouponOddExtended): void {
    this.remove = true;
    if (this.couponService.coupon.Odds.length === 1) {
      this.clearCoupon();
      return;
    }
    this.couponService.addToRemoveToCouponLottery(odd.SelectionId, Number(odd.SelectionName));
  }

  clearCoupon(): void {
    this.couponService.resetCoupon();
  }

  ngOnDestroy(): void {
    this.clearCoupon();
    this.couponServiceSubscription.unsubscribe();
  }

  // change stake from odd's coupon
  checkOddToChangeStake(odd: BetCouponOdd): void {
    this.couponService.checkOddToChangeStake(odd);
  }

  // open dialog
  openDialog(): void {
    if (this.couponService.coupon) {
      this.productService.openProductDialog({ title: 'COUPON', betCoupon: this.couponService.coupon });
    }
  }

  public getNumberColour(number: string): string {
    const colourNumber: number = parseInt(number, 10);
    if (colourNumber === 49) {
      return Colour[Colour.YELLOW];
    }
    if (colourNumber % 3 === 1) {
      return Colour[Colour.RED];
    }
    if (colourNumber % 3 === 2) {
      return Colour[Colour.BLUE];
    }
    if (colourNumber % 3 === 0) {
      return Colour[Colour.GREEN];
    }
  }

  public getRainbowColour(marketName: string): string {
    switch (marketName) {
      case 'rainbowb': return Colour[Colour.BLUE];
      case 'rainbowr': return Colour[Colour.RED];
      case 'rainbowg': return Colour[Colour.GREEN];
      default: return Colour[Colour.YELLOW];
    }
  }

  public getTotalColour(totalColour: string): string {
    switch (totalColour) {
      case 'b': return Colour[Colour.BLUE];
      case 'r': return Colour[Colour.RED];
      case 'g': return Colour[Colour.GREEN];
      default: return 'BLACK';
    }
  }

  public getTotalColourSelectionName(totalColour: string): string {
    switch (totalColour) {
      case 'b': return this.translateService.getTranslatedString('BLUE');
      case 'r': return this.translateService.getTranslatedString('RED');
      case 'g': return this.translateService.getTranslatedString('GREEN');
      case 'n': return this.translateService.getTranslatedString('NO_WINNING_COLOUR');
      default: return '';
    }
  }

  isBetDisabledForColoursDrangn(): boolean {

    if (this.listOdds && this.listOdds.length > 0 && this.listOdds[0].MarketName === ColourGameId[ColourGameId.dragon]) {
      if ((this.listOdds.length >= 6 && this.listOdds.length <= 10) || this.listOdds.length === 15) {
        return false;
      }
      return true;
    }

    return false;
  }

  // American Roulette
  getNumber(n: number): string {
    const americanRoulette: AmericanRouletteRug = new AmericanRouletteRug();
    if (americanRoulette.red.includes(parseInt(n.toString(), 10))) {
      return Colour[Colour.RED];
    } else if (americanRoulette.black.includes(parseInt(n.toString(), 10))) {
      return Colour[Colour.BLACK];
    } else {
      return Colour[Colour.GREEN];
    }
  }

  isBetBtnDisabled(source: PlaySource): boolean {
    const isCouponError: boolean = !!this.couponService.error 
    || this.couponService.isWaitingConclusionOperation 
    || this.isBetDisabledForColoursDrangn() 
    || this.couponService.processingOddsQueue;
    const isCouponErrorAndroid: boolean = this.timeBlocked || this.userService.isModalOpen || isCouponError;
    return source ===  PlaySource.VDeskGApp ? isCouponErrorAndroid : isCouponError;
  }

}
