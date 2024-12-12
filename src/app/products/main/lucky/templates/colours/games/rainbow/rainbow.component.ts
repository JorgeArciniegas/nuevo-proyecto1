import { Component } from '@angular/core';
import { BtncalcService } from '../../../../../../../component/btncalc/btncalc.service';
import { CouponService } from '../../../../../../../component/coupon/coupon.service';
import { UserService } from '../../../../../../../services/user.service';
import { ColourGameId } from '../../../../../colour-game.enum';
import { MainService } from '../../../../../main.service';
import { Colour, ColoursSelection } from '../../../../../playable-board/templates/colours/colours.models';

@Component({
  selector: 'app-lucky-rainbow',
  templateUrl: './rainbow.component.html',
  styleUrls: ['./rainbow.component.scss']
})
export class RainbowComponent {
  public Colour: typeof Colour = Colour;

  constructor(
    public mainService: MainService,
    private btnCalcService: BtncalcService,
    private couponService: CouponService,
    public userService: UserService
  ) { }

  public async placingColourLucky(colour?: Colour): Promise<void> {
    this.couponService.resetCoupon();
    this.mainService.resetPlayEvent();
    if (colour === undefined) {
      const extractedColor: number = Math.floor(Math.random() * 3);
      switch (extractedColor) {
        case 0: colour = Colour.BLUE; break;
        case 1: colour = Colour.RED; break;
        case 2: colour = Colour.GREEN; break;
        default:
          break;
      }
    }
    const extract: number = Math.floor(Math.random() * 5);
    const selection: ColoursSelection = {
      name: extract > 0 ? (extract + 1).toString() : extract.toString(),
      colour,
      isSelected: false
    };
    let colorString: string;
    switch (selection.colour) {
      case Colour.BLUE: colorString = 'b'; break;
      case Colour.RED: colorString = 'r'; break;
      case Colour.GREEN: colorString = 'g'; break;
      default:
        break;
    }
    this.mainService.placingColoursSelection(colorString + selection.name);
    this.mainService.getCurrentEvent().then(
      (item) => {
        const eventid = item.mk[0].sls[0].id;
        this.btnCalcService.coloursPushToCoupon(
          eventid,
          ColourGameId[this.mainService.selectedColourGameId].toString() + colorString,
          selection.name
        );
      });
  }



}
