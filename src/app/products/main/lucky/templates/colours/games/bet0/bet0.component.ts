import { Component } from '@angular/core';
import { BtncalcService } from '../../../../../../../component/btncalc/btncalc.service';
import { ColourGameId } from '../../../../../colour-game.enum';
import { MainService } from '../../../../../main.service';
import { UserService } from '../../../../../../../services/user.service';
import { Lucky } from '../../../../lucky.model';

@Component({
  selector: 'app-lucky-bet0',
  templateUrl: './bet0.component.html',
  styleUrls: ['./bet0.component.scss']
})
export class Bet0Component {
  lucky: typeof Lucky = Lucky;

  constructor(public mainService: MainService, private btnCalcService: BtncalcService, public userService: UserService) { }

  public async placingColourLucky(lucky: Lucky): Promise<void> {
    this.mainService.resetPlayEvent();
    const extractedColoursNumbers: number[] = this.extractColoursNumbers(lucky);
    const extractedColoursNumbersStrings: string[] = extractedColoursNumbers.map(x => x.toString());
    let eventid;
    await this.mainService.getCurrentEvent().then(
      (item) => { eventid = item.mk[0].sls[0].id; }
    );
    for (const selectedNumber of extractedColoursNumbers) {
      this.mainService.placingColoursNumber(selectedNumber);
    }
    this.btnCalcService.coloursMultiPushToCoupon(
      eventid,
      ColourGameId[this.mainService.selectedColourGameId].toString(),
      extractedColoursNumbersStrings);
  }

  private extractColoursNumbers(extractCounterIdx: number): number[] {
    const extractMatchesIdx: number[] = [];
    while (extractCounterIdx !== 0) {
      const extractNumber: number = Math.floor(Math.random() * 49) + 1;
      if (!extractMatchesIdx.includes(extractNumber)) {
        extractMatchesIdx.push(extractNumber);
        extractCounterIdx--;
      }
    }
    return extractMatchesIdx;
  }

}
