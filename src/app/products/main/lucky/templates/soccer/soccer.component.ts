import { Component } from '@angular/core';
import { UserService } from '../../../../../services/user.service';
import { Area } from '../../../main.models';
import { MainService } from '../../../main.service';
import { SoccerService } from '../../../playable-board/templates/soccer/soccer.service';
import { Lucky } from '../../lucky.model';

@Component({
  selector: 'app-lucky-soccer',
  templateUrl: './soccer.component.html',
  styleUrls: ['./soccer.component.scss']
})
export class SoccerComponent {
  lucky: typeof Lucky = Lucky;
  constructor(private mainService: MainService, public userService: UserService, private soccerService: SoccerService) { }

  /**
   *
   * @param lucky
   */
  public async placeLucky(lucky: Lucky): Promise<void> {
    // reset all odds selected
    this.soccerService.couponService.resetCoupon();
    this.mainService.resetPlayEvent();
    const extractMatchesIdx: number[] = lucky !== Lucky.Lucky10 ? this.rngMatches(lucky) : this.selectAllMatches();
    const tournament = await this.mainService.getCurrentTournament();

    this.rngMarketsAndPlace(extractMatchesIdx, tournament.overviewArea);
  }

  /**
   *
   */
  private selectAllMatches(): number[] {
    const extractMatchesIdx: number[] = [];
    for (let i = 0; i < Lucky.Lucky10; i++) {
      extractMatchesIdx.push(i);
    }
    return extractMatchesIdx;
  }

  /**
   *
   * @param extractCounterIdx
   */
  private rngMatches(extractCounterIdx: number): number[] {
    const extractMatchesIdx: number[] = [];
    while (true) {
      const extractNumber: number = Math.floor(Math.random() * 10);
      if (!extractMatchesIdx.includes(extractNumber)) {
        extractMatchesIdx.push(extractNumber);
        extractCounterIdx--;
      }
      if (extractCounterIdx === 0) {
        return extractMatchesIdx;
      }
    }
  }

  /**
   *
   * @param extractMatchesIdx
   * @param areas
   */
  private rngMarketsAndPlace(extractMatchesIdx: number[], areas: Area[]): void {
    while (extractMatchesIdx.length > 0) {
      const match = extractMatchesIdx.shift();
      const tournament = areas[match].markets;
      const rngMarkets = Math.floor(Math.random() * tournament.length);
      // Get the odd to select. It must have a value greater than 1.05.
      let rngSelection: number;
      do {
        rngSelection = Math.floor(Math.random() * areas[match].markets[rngMarkets].selectionCount);
      } while (!areas[match].markets[rngMarkets].selections[rngSelection].isValid);
      this.soccerService.selectOdd(
        areas[match].markets[rngMarkets].selections[rngSelection].tp,
        areas[match].markets[rngMarkets].selections[rngSelection]
      );
    }
  }
}
