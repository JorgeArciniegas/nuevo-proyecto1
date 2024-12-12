import { Component } from '@angular/core';
import { BtncalcService } from '../../../../../../../component/btncalc/btncalc.service';
import { CouponService } from '../../../../../../../component/coupon/coupon.service';
import { ColourGameId } from '../../../../../../../products/main/colour-game.enum';
import { MainService } from '../../../../../../../products/main/main.service';
import { Band, ColoursSelection } from '../../../../../../../products/main/playable-board/templates/colours/colours.models';
import { UserService } from '../../../../../../../services/user.service';

@Component({
  selector: 'app-lucky-hilo',
  templateUrl: './hilo.component.html',
  styleUrls: ['./hilo.component.scss']
})
export class HiloComponent {

  private selections: ColoursSelection[];

  constructor(
    public mainService: MainService,
    private btnCalcService: BtncalcService,
    private couponService: CouponService,
    public userService: UserService
  ) {
    this.selections = [
      { band: Band.HI, name: 'HI', interval: '152 - 279', isSelected: false },
      { band: Band.MID, name: 'MID', interval: '149 - 151', isSelected: false },
      { band: Band.LO, name: 'LO', interval: '21 - 148', isSelected: false }
    ];
  }

  public placingLucky(): void {
    this.couponService.resetCoupon();
    this.mainService.resetPlayEvent();
    const extract: number = Math.floor(Math.random() * 3);
    const selection: ColoursSelection = this.selections[extract];
    this.mainService.placingColoursSelection(selection.name);
    this.mainService.getCurrentEvent().then(
      (item) => {
        const eventid = item.mk[0].sls[0].id;
        this.btnCalcService.coloursPushToCoupon(
          eventid,
          ColourGameId[this.mainService.selectedColourGameId].toString(),
          selection.band.toString()
        );
      });
  }

}
