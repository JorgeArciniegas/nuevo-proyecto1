import { Component } from '@angular/core';
import { BtncalcService } from '../../../../../component/btncalc/btncalc.service';
import { CouponService } from '../../../../../component/coupon/coupon.service';
import { UserService } from '../../../../../services/user.service';
import { MainService } from '../../../main.service';
import { KenoNumber } from '../../../playable-board/templates/keno/keno.model';
import { Lucky } from '../../lucky.model';

@Component({
  selector: 'app-lucky-keno',
  templateUrl: './keno.component.html',
  styleUrls: ['./keno.component.scss']
})
export class KenoComponent {
  public lucky: typeof Lucky = Lucky;

  constructor(
    private mainService: MainService,
    public userService: UserService,
    private btncalcService: BtncalcService,
    private couponService: CouponService) { }

  public placeLucky(lucky: Lucky): void {
    // reset all odds selected
    this.couponService.resetCoupon();
    this.mainService.resetPlayEvent();
    const extractedNumbers: number[] = this.extractKenoNumbers(lucky);
    this.processLuckyNumbersQueue(extractedNumbers);
  }

  private processLuckyNumbersQueue(extractedNumbers: number[]): void {
    while (extractedNumbers.length > 0) {
      const kenoNumber: KenoNumber = {
        number: extractedNumbers.pop(),
        isSelected: true
      };
      this.mainService.getCurrentEvent().then(
        (item) => {
          this.mainService.placingNumber(kenoNumber);
          this.btncalcService.lotteryPushToCoupon(kenoNumber.number, item.mk[0].sls[0].id);
        });
    }
  }

  private extractKenoNumbers(extractCounterIdx: number): number[] {
    const extractMatchesIdx: number[] = [];
    while (extractCounterIdx !== 0) {
      const extractNumber: number = Math.floor(Math.random() * 80) + 1;
      if (!extractMatchesIdx.includes(extractNumber)) {
        extractMatchesIdx.push(extractNumber);
        extractCounterIdx--;
      }
    }
    return extractMatchesIdx;
  }

}
