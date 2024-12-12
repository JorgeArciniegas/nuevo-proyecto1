import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../../../../../products/main/main.service';
import { BtncalcService } from '../../../../../../../component/btncalc/btncalc.service';
import { UserService } from '../../../../../../../services/user.service';
import { ColourGameId } from '../../../../../../../products/main/colour-game.enum';
import { CouponService } from '../../../../../../../component/coupon/coupon.service';

@Component({
  selector: 'app-lucky-total-colour',
  templateUrl: './total-colour.component.html',
  styleUrls: ['./total-colour.component.scss']
})
export class TotalColourComponent implements OnInit {
  private totalColoursSelections: string[] = ['R', 'G', 'B', 'N'];

  constructor(
    public mainService: MainService,
    private btnCalcService: BtncalcService,
    public userService: UserService,
    private couponService: CouponService) { }

  ngOnInit() {
  }

  public async placingColourLucky(): Promise<void> {
    this.couponService.resetCoupon();
    this.mainService.resetPlayEvent();
    const extractedNumber: number = this.extractColoursNumbers();
    this.mainService.placingColoursSelection(this.totalColoursSelections[extractedNumber]);
    let eventid;
    await this.mainService.getCurrentEvent().then(
      (item) => { eventid = item.mk[0].sls[0].id; }
    );
    this.btnCalcService.coloursPushToCoupon(
      eventid,
      ColourGameId[this.mainService.selectedColourGameId].toString(),
      this.totalColoursSelections[extractedNumber]);
  }

  private extractColoursNumbers(): number {
    return Math.floor(Math.random() * 4);
  }

}
