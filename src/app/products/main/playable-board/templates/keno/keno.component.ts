import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BetCouponExtended, ElysCouponService } from '@elys/elys-coupon';
import { Subscription } from 'rxjs';
import { BtncalcService } from '../../../../../component/btncalc/btncalc.service';
import { CouponService } from '../../../../../component/coupon/coupon.service';
import { MainService } from '../../../main.service';
import { KenoNumber } from './keno.model';

@Component({
  selector: 'app-playable-board-keno',
  templateUrl: './keno.component.html',
  styleUrls: ['./keno.component.scss']
})
export class KenoComponent implements OnInit, OnDestroy {

  @Input()
  public rowHeight: number;
  kenoTable: KenoNumber[] = [];
  numberSelectionQueue: KenoNumber[];

  couponHasChangedSubscription: Subscription;
  couponHasBeenPlacedSubscription: Subscription;
  constructor(
    private mainService: MainService,
    private btnCalcService: BtncalcService,
    private elysCoupon: ElysCouponService,
    private couponService: CouponService
  ) {
    this.numberSelectionQueue = [];
  }

  ngOnDestroy(): void {
    if (this.couponHasChangedSubscription) {
      this.couponHasChangedSubscription.unsubscribe();
    }

    if (this.couponHasBeenPlacedSubscription) {
      this.couponHasBeenPlacedSubscription.unsubscribe();
    }
  }

  /**
   * Check the Keno number selected
   * @param coupon
   */
  verifySelectedOdds(coupon: BetCouponExtended): void {
    // extract a temp array that contains
    const tmpRealSel: number[] = coupon.Odds.map(x => Number(x.SelectionName));

    // compare with show table and remove the selected when the selection is delete
    this.kenoTable.forEach(item => {
      const idx = tmpRealSel.find(i => i === item.number);
      if (!idx) {
        item.isSelected = false;
      }
    });

    // update the table selection
    tmpRealSel.forEach(odd => {
      const kenoSel = this.kenoTable.findIndex(obj => obj.number === odd);
      if (kenoSel !== -1) {
        this.kenoTable[kenoSel].isSelected = true;
      }
    });

    // update the queue selection
    this.numberSelectionQueue = this.numberSelectionQueue.filter(
      item => tmpRealSel.indexOf(item.number) < 0 &&
        this.kenoTable.find(i => i.number === item.number && i.isSelected !== item.isSelected)
    );

  }

  ngOnInit(): void {
    this.initKenoNumbers();
    // check coupon
    this.couponHasChangedSubscription = this.elysCoupon.couponHasChanged.subscribe(coupon => {
      if (coupon) {
        this.verifySelectedOdds(coupon);
      } else {
        this.numberSelectionQueue = [];

        // The coupon was removed.
        this.kenoTable.map(item => {
          if (item.isSelected) {
            item.isSelected = false;
          }
        });
      }
    });

    // Reload selection when the coupon has been deleted or has been placed
    this.couponHasBeenPlacedSubscription = this.couponService.couponHasBeenPlacedObs.subscribe(b => {
      this.kenoTable.map(item => {
        if (item.isSelected) {
          item.isSelected = false;
        }
      });
      if (!this.kenoTable.find(item => item.isSelected === true)) {
        this.numberSelectionQueue = [];
      }
    });
  }

  async onNumberClick(kenoNumber: KenoNumber) {
    // kenoNumber.isSelected = !kenoNumber.isSelected;
    if (this.numberSelectionQueue.includes(kenoNumber)) {
      return;
    }
    this.numberSelectionQueue.push(kenoNumber);
    this.mainService.placingNumber(kenoNumber);
    let eventid;
    await this.mainService.getCurrentEvent().then(
      (item) => { eventid = item.mk[0].sls[0].id; }
    );
    this.btnCalcService.lotteryPushToCoupon(kenoNumber.number, eventid);
  }

  private initKenoNumbers(): void {
    const kenoNumbers: KenoNumber[] = [];
    for (let i = 1; i <= 80; ++i) {
      const kenoNumber: KenoNumber = {
        number: i,
        isSelected: false
      };
      kenoNumbers.push(kenoNumber);
    }
    this.kenoTable = kenoNumbers;
  }
}
