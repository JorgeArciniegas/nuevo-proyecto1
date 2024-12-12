import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BetCouponExtended, BetCouponOddExtended, ElysCouponService } from '@elys/elys-coupon';
import { Subscription } from 'rxjs';
import { BtncalcService } from '../../../../../../../component/btncalc/btncalc.service';
import { CouponService } from '../../../../../../../component/coupon/coupon.service';
import { UserService } from '../../../../../../../services/user.service';
import { ColourGameId } from '../../../../../colour-game.enum';
import { MainService } from '../../../../../main.service';
import { Colour, ColoursSelection } from '../../colours.models';

@Component({
  selector: 'app-playable-board-rainbow',
  templateUrl: './rainbow.component.html',
  styleUrls: ['./rainbow.component.scss']
})
export class RainbowComponent implements OnInit, OnDestroy {

  @Input() public rowHeight: number;

  public selections: ColoursSelection[];
  public waitingSelection: ColoursSelection;

  public Colour: typeof Colour = Colour;

  // coupon management
  private couponHasChangedSubscription: Subscription;
  private couponHasBeenPlacedSubscription: Subscription;

  constructor(
    public mainService: MainService,
    private btnCalcService: BtncalcService,
    private elysCoupon: ElysCouponService,
    public userService: UserService,
    private couponService: CouponService
  ) {
  }

  ngOnInit() {
    this.initColours();
    // check coupon
    this.couponHasChangedSubscription = this.elysCoupon.couponHasChanged.subscribe(coupon => {
      if (coupon) {
        this.verifySelectedOdds(coupon);
      } else {
        this.waitingSelection = undefined;

        // The coupon was removed.
        this.selections.map(item => {
          if (item.isSelected) {
            item.isSelected = false;
          }
        });
      }
    });

    // Reload selection when the coupon has been deleted or has been placed
    this.couponHasBeenPlacedSubscription = this.couponService.couponHasBeenPlacedObs.subscribe(b => {
      this.selections.map(item => {
        if (item.isSelected) {
          item.isSelected = false;
        }
      });
      if (!this.selections.find(item => item.isSelected === true)) {
        this.waitingSelection = undefined;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.couponHasChangedSubscription) {
      this.couponHasChangedSubscription.unsubscribe();
    }

    if (this.couponHasBeenPlacedSubscription) {
      this.couponHasBeenPlacedSubscription.unsubscribe();
    }
  }

  private initColours(): void {
    this.selections = [];
    for (const colour of [Colour.RED, Colour.BLUE, Colour.GREEN]) {
      for (let index = 1; index < 7; index++) {
        const number = index > 1 ? index : 0;
        this.selections.push({ name: number.toString(), isSelected: false, colour });
      }
    }
  }

  public getColouredRow(colour: Colour): ColoursSelection[] {
    return this.selections.filter(s => s.colour === colour);
  }

  // select band
  public selectColourNumber(selection: ColoursSelection): void {
    if (this.waitingSelection && this.waitingSelection.name === selection.name) {
      return;
    }
    // add band to waiting
    this.waitingSelection = selection;

    let colour: string;
    switch (selection.colour) {
      case Colour.BLUE: colour = 'b'; break;
      case Colour.RED: colour = 'r'; break;
      case Colour.GREEN: colour = 'g'; break;
      default:
        break;
    }
    // add to coupon
    this.mainService.placingColoursSelection(colour + selection.name);
    this.mainService.getCurrentEvent().then(item => {
      const eventid = item.mk[0].sls[0].id;
      this.btnCalcService.coloursPushToCoupon(
        eventid,
        ColourGameId[this.mainService.selectedColourGameId].toString() + colour,
        selection.name !== '0' ? (selection.name + '+') : selection.name
      );
    });

  }

  /**
   * Check if button is disabled
   * @param selection selection to check
   */
  isDisabled(selection: ColoursSelection): boolean {
    // check if exist waiting selecion
    if (this.waitingSelection && (this.waitingSelection.name !== selection.name || this.waitingSelection.colour !== selection.colour)) {
      return true;
    }
    // check if exist selected selection
    if (this.selections.filter(s => s.isSelected && (s.name !== selection.name || s.colour !== selection.colour)).length > 0) {
      return true;
    }

    return false;
  }

  /**
   * Check the Keno number selected
   * @param coupon
   */
  verifySelectedOdds(coupon: BetCouponExtended): void {

    const couponSelection: BetCouponOddExtended = coupon.Odds[0];
    const name: string = couponSelection.SelectionName.replace('+', '');
    let colour: Colour;
    switch (couponSelection.MarketName) {
      case 'rainbowb': colour = Colour.BLUE; break;
      case 'rainbowr': colour = Colour.RED; break;
      case 'rainbowg': colour = Colour.GREEN; break;
      default:
        break;
    }

    // compare with show table and remove the selected when the selection is delete
    this.selections.forEach(item => {
      if (item.name === name && item.colour === colour) {
        item.isSelected = true;
      } else {
        item.isSelected = false;
      }
    });

    // update the waiting selection
    if (this.waitingSelection && this.waitingSelection.name === name && this.waitingSelection.colour === colour) {
      this.waitingSelection = undefined;
    }

  }
}
