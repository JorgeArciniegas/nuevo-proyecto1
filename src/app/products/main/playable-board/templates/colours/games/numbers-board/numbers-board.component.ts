import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BetCouponExtended, ElysCouponService } from '@elys/elys-coupon';
import { Subscription } from 'rxjs';
import { BtncalcService } from '../../../../../../../component/btncalc/btncalc.service';
import { CouponService } from '../../../../../../../component/coupon/coupon.service';
import { ColourGameId } from '../../../../../../../products/main/colour-game.enum';
import { MainService } from '../../../../../../../products/main/main.service';
import { Colour, ColoursNumber } from '../../colours.models';

@Component({
  selector: 'app-colours-numbers-board',
  templateUrl: './numbers-board.component.html',
  styleUrls: ['./numbers-board.component.scss']
})
export class NumbersBoardComponent implements OnDestroy, OnInit {
  public coloursNumbers: ColoursNumber[] = [];
  public numberSelectionQueue: ColoursNumber[] = [];
  public Colour = Colour;
  @Input() public rowHeight: number;
  @Input() public maxNumberOfSelections: number;

  private couponHasChangedSubscription: Subscription;
  private couponHasBeenPlacedSubscription: Subscription;

  constructor(
    private mainService: MainService,
    private btnCalcService: BtncalcService,
    private elysCoupon: ElysCouponService,
    private couponService: CouponService
  ) {
    this.initColoursNumbers();
  }

  public ngOnInit(): void {
    // check coupon
    this.couponHasChangedSubscription = this.elysCoupon.couponHasChanged.subscribe(coupon => {
      if (coupon) {
        this.verifySelectedOdds(coupon);
      } else {
        this.numberSelectionQueue = [];

        // The coupon was removed.
        this.coloursNumbers.map(item => {
          if (item.isSelected) {
            item.isSelected = false;
          }
        });
      }
    });

    // Reload selection when the coupon has been deleted or has been placed
    this.couponHasBeenPlacedSubscription = this.couponService.couponHasBeenPlacedObs.subscribe(b => {
      this.coloursNumbers.map(item => {
        item.isDisabled = false;
        if (item.isSelected) {
          item.isSelected = false;
        }
      });
      if (!this.coloursNumbers.find(item => item.isSelected === true)) {
        this.numberSelectionQueue = [];
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

  public async onNumberClick(coloursNumber: ColoursNumber) {
    if (this.numberSelectionQueue.includes(coloursNumber)) {
      return;
    }
    this.numberSelectionQueue.push(coloursNumber);
    this.mainService.placingColoursNumber(coloursNumber.number);
    let eventid;
    await this.mainService.getCurrentEvent().then(
      (item) => { eventid = item.mk[0].sls[0].id; }
    );
    this.btnCalcService.coloursPushToCoupon(
      eventid,
      ColourGameId[this.mainService.selectedColourGameId].toString(),
      coloursNumber.number.toString());
  }

  /**
 * Check the Colours number selected
 * @param coupon
 */
  private verifySelectedOdds(coupon: BetCouponExtended): void {
    // extract a temp array that contains
    const tmpRealSel: number[] = coupon.Odds.map(x => Number(x.SelectionName));

    // compare with show table and remove the selected when the selection is delete
    this.coloursNumbers.forEach(item => {
      const idx = tmpRealSel.find(i => i === item.number);
      if (!idx) {
        item.isSelected = false;
      }
    });

    // update the table selection
    tmpRealSel.forEach(odd => {
      const coloursSel = this.coloursNumbers.findIndex(obj => obj.number === odd);
      if (coloursSel !== -1) {
        this.coloursNumbers[coloursSel].isSelected = true;
      }
    });

    // update the queue selection
    this.numberSelectionQueue = this.numberSelectionQueue.filter(
      item => tmpRealSel.indexOf(item.number) < 0 &&
        this.coloursNumbers.find(i => i.number === item.number && i.isSelected !== item.isSelected)
    );

    // Check maximum number of selections for this game
    if (tmpRealSel.length >= this.maxNumberOfSelections) {
      this.coloursNumbers.forEach(coloursNumber =>
        coloursNumber.isSelected ? coloursNumber.isDisabled = false : coloursNumber.isDisabled = true);
    } else {
      this.coloursNumbers.forEach(coloursNumber => coloursNumber.isDisabled = false);
    }
  }

  private initColoursNumbers(): void {
    const coloursNumbers: ColoursNumber[] = [];
    for (let i = 1; i <= 48; ++i) {
      const coloursNumber: ColoursNumber = {
        number: i,
        isSelected: false,
        colour: this.checkNumberColour(i),
        isDisabled: false
      };
      coloursNumbers.push(coloursNumber);
    }
    const lastColoursNumber: ColoursNumber = {
      number: 49,
      isSelected: false,
      colour: Colour.YELLOW,
      isDisabled: false
    };
    coloursNumbers.push(lastColoursNumber);
    this.coloursNumbers = coloursNumbers;
  }

  private checkNumberColour(colourNumber: number): Colour {
    if (colourNumber % 3 === 1) {
      return Colour.RED;
    }
    if (colourNumber % 3 === 2) {
      return Colour.BLUE;
    }
    if (colourNumber % 3 === 0) {
      return Colour.GREEN;
    }
  }

}
