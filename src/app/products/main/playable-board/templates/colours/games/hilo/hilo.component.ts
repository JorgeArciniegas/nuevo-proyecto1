import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BetCouponExtended, ElysCouponService } from '@elys/elys-coupon';
import { Subscription } from 'rxjs';
import { BtncalcService } from '../../../../../../../component/btncalc/btncalc.service';
import { CouponService } from '../../../../../../../component/coupon/coupon.service';
import { ColourGameId } from '../../../../../../../products/main/colour-game.enum';
import { UserService } from '../../../../../../../services/user.service';
import { MainService } from '../../../../../main.service';
import { Band, ColoursSelection } from '../../colours.models';

@Component({
  selector: 'app-playable-board-hilo',
  templateUrl: './hilo.component.html',
  styleUrls: ['./hilo.component.scss']
})
export class HiLoComponent implements OnInit, OnDestroy {

  @Input() public rowHeight: number;

  public selections: ColoursSelection[];
  public waitingSelection: ColoursSelection;

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
    this.initColoursBand();
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

  private initColoursBand(): void {
    this.selections = [
      { band: Band.HI, name: 'HI', interval: '152 - 279', isSelected: false },
      { band: Band.MID, name: 'MID', interval: '149 - 151', isSelected: false },
      { band: Band.LO, name: 'LO', interval: '21 - 148', isSelected: false }
    ];
  }

  // select band
  public selectBand(selection: ColoursSelection): void {
    if (this.waitingSelection && this.waitingSelection.name === selection.name) {
      return;
    }
    // add band to waiting
    this.waitingSelection = selection;

    // add to coupon
    this.mainService.placingColoursSelection(selection.name);
    this.mainService.getCurrentEvent().then(item => {
      const eventid = item.mk[0].sls[0].id;
      this.btnCalcService.coloursPushToCoupon(
        eventid,
        ColourGameId[this.mainService.selectedColourGameId].toString(),
        selection.band.toString()
      );
    });

  }

  /**
   * Check if button is disabled
   * @param selection selection to check
   */
  isDisabled(selection: ColoursSelection): boolean {
    // check if exist waiting selecion
    if (this.waitingSelection && this.waitingSelection.name !== selection.name) {
      return true;
    }
    // check if exist selected selection
    if (this.selections.filter(s => s.isSelected && s.name !== selection.name).length > 0) {
      return true;
    }

    return false;
  }

  /**
   * Check the Keno number selected
   * @param coupon
   */
  verifySelectedOdds(coupon: BetCouponExtended): void {
    // extract a temp array that contains
    const tmpRealSel: string[] = coupon.Odds.map(x => x.SelectionName);

    const couponSelection: string = tmpRealSel[0];

    // compare with show table and remove the selected when the selection is delete
    this.selections.forEach(item => {
      if (item.band === couponSelection) {
        item.isSelected = true;
      } else {
        item.isSelected = false;
      }
    });

    // update the waiting selection
    if (this.waitingSelection && this.waitingSelection.band === couponSelection) {
      this.waitingSelection = undefined;
    }

  }
}
