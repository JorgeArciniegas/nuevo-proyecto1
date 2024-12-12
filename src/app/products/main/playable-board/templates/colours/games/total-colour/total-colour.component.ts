import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ElysCouponService } from '@elys/elys-coupon';
import { BetCouponExtended } from '@elys/elys-coupon/lib/elys-coupon.models';
import { Subscription } from 'rxjs';
import { UserService } from '../../../../../../../services/user.service';
import { BtncalcService } from '../../../../../../../component/btncalc/btncalc.service';
import { CouponService } from '../../../../../../../component/coupon/coupon.service';
import { ColourGameId } from '../../../../../../../products/main/colour-game.enum';
import { MainService } from '../../../../../../../products/main/main.service';
import { Colour, TotalColourSelection } from '../../colours.models';

@Component({
  selector: 'app-playable-board-total-colour',
  templateUrl: './total-colour.component.html',
  styleUrls: ['./total-colour.component.scss']
})
export class TotalColourComponent implements OnInit, OnDestroy {
  @Input() public rowHeight: number;
  public Colour = Colour;
  public selectionQueue: TotalColourSelection[] = [];
  public totalColourSelections: TotalColourSelection[] = [];

  private couponHasChangedSubscription: Subscription;
  private couponHasBeenPlacedSubscription: Subscription;

  constructor(
    public mainService: MainService,
    private btnCalcService: BtncalcService,
    private elysCoupon: ElysCouponService,
    private couponService: CouponService,
    public userService: UserService
  ) {
    this.initTotalColourSelection();
  }

  public ngOnInit(): void {
    // check coupon
    this.couponHasChangedSubscription = this.elysCoupon.couponHasChanged.subscribe(coupon => {
      if (coupon) {
        this.verifySelectedOdds(coupon);
      } else {
        this.selectionQueue = [];

        // The coupon was removed.
        this.totalColourSelections.map(item => {
          if (item.isSelected) {
            item.isSelected = false;
          }
        });
      }
    });

    // Reload selection when the coupon has been deleted or has been placed
    this.couponHasBeenPlacedSubscription = this.couponService.couponHasBeenPlacedObs.subscribe(b => {
      this.totalColourSelections.map(item => {
        item.isDisabled = false;
        if (item.isSelected) {
          item.isSelected = false;
        }
      });
      if (!this.totalColourSelections.find(item => item.isSelected === true)) {
        this.selectionQueue = [];
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

  public async onNumberClick(totalColourSelection: TotalColourSelection): Promise<void> {
    if (this.selectionQueue.includes(totalColourSelection)) {
      return;
    }
    this.selectionQueue.push(totalColourSelection);
    this.mainService.placingColoursSelection(totalColourSelection.marketSelection);
    let eventid;
    await this.mainService.getCurrentEvent().then(
      (item) => { eventid = item.mk[0].sls[0].id; }
    );
    this.btnCalcService.coloursPushToCoupon(
      eventid,
      ColourGameId[this.mainService.selectedColourGameId].toString(),
      totalColourSelection.marketSelection);
  }

  /**
* Check the Colours number selected
* @param coupon
*/
  private verifySelectedOdds(coupon: BetCouponExtended): void {
    // extract a temp array that contains
    const tmpRealSel: string[] = coupon.Odds.map(x => x.SelectionName);

    // compare with show table and remove the selected when the selection is delete
    this.totalColourSelections.forEach(item => {
      const idx = tmpRealSel.find(i => i === item.marketSelection);
      if (!idx) {
        item.isSelected = false;
      }
    });

    // update the table selection
    tmpRealSel.forEach(odd => {
      const coloursSel = this.totalColourSelections.findIndex(obj => obj.marketSelection === odd);
      if (coloursSel !== -1) {
        this.totalColourSelections[coloursSel].isSelected = true;
      }
    });

    // update the queue selection
    this.selectionQueue = this.selectionQueue.filter(
      item => tmpRealSel.indexOf(item.name) < 0 &&
        this.totalColourSelections.find(i => i.name === item.name && i.isSelected !== item.isSelected)
    );

    // Check maximum number of selections for this game
    if (tmpRealSel.length === 1) {
      this.totalColourSelections.forEach(coloursNumber =>
        coloursNumber.isSelected ? coloursNumber.isDisabled = false : coloursNumber.isDisabled = true);
    } else {
      this.totalColourSelections.forEach(coloursNumber => coloursNumber.isDisabled = false);
    }
  }

  private initTotalColourSelection(): void {
    const totalColourSelections: TotalColourSelection[] = [];
    for (let i = 1; i <= 4; ++i) {
      const totalColourSelection: TotalColourSelection = {
        name: i !== 4 ? Colour[this.checkNumberColour(i)].toString() : 'NO_WINNING_COLOUR',
        colour: this.checkNumberColour(i),
        marketSelection: Colour[this.checkNumberColour(i)].toString().substr(0, 1).toLocaleLowerCase(),
        isSelected: false,
        isDisabled: false
      };
      totalColourSelections.push(totalColourSelection);
    }
    this.totalColourSelections = totalColourSelections;
  }

  private checkNumberColour(colourNumber: number): Colour {
    if (colourNumber === 4) {
      return Colour.NONE;
    }
    if (colourNumber % 3 === 0) {
      return Colour.GREEN;
    }
    if (colourNumber % 3 === 1) {
      return Colour.RED;
    }
    if (colourNumber % 3 === 2) {
      return Colour.BLUE;
    }
  }

}
