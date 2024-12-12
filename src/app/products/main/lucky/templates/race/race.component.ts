import { Component } from '@angular/core';
import { Lucky } from '../../lucky.model';
import { UserService } from '../../../../../../../src/app/services/user.service';
import { MainService } from '../../../main.service';
import { LAYOUT_TYPE } from '../../../../../../../src/environments/environment.models';
import { Player } from '../../../main.models';

@Component({
  selector: 'app-lucky-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss']
})
export class RaceComponent {
  typeLayout: typeof LAYOUT_TYPE = LAYOUT_TYPE;
  oldLuckyRace: string;
  lucky: typeof Lucky = Lucky;
  constructor(
    private userService: UserService,
    private mainService: MainService
  ) {}

  /**
   * @param lucky number of players involved (1: winner 2: acc, 3: trifecta)
   */
  placingLuckyRace(lucky: Lucky): void {
    this.mainService.resetPlayEvent();
    let n = '';
    // loop the number of player involved
    for (let i = 1; i <= lucky; i++) {
      while (true) {
        // for each one get the player number randomly according the current lucky (this.RNGLucky2(i);)
        const extTemp: number = this.RNGLucky2(i);
        // check if the player extracted already exists
        if (n.indexOf(extTemp.toString()) === -1) {
          n += extTemp;
          break;
        }
      }
    }
    // if the selection is not equals to oldLucky selected place bet
    if (n !== this.oldLuckyRace || this.oldLuckyRace === undefined) {
      // save the temporary selection
      this.oldLuckyRace = n;
      for (let i = 0; i < n.length; i++) {
        const element = n.charAt(i);
        this.RNGLuckyPlacing(parseInt(element, 10), i + 1);
      }
    } else {
      this.placingLuckyRace(lucky);
    }
  }

  /**
   * RNG TO PLACE THE LUCKY
   */

  RNGLucky2(lucky: Lucky): number {
    const extractNumber: number =
      Math.floor(
        Math.random() *
          this.mainService.playersList.filter(
            player => player.position === lucky
          ).length
      ) + 1;
    return extractNumber;
  }

  RNGLuckyPlacing(playerNumber: number, playerPosition: number): void {
    // extract the player
    const playerExtract: Player = this.mainService.playersList.filter(
      player =>
        player.position === playerPosition && player.number === playerNumber
    )[0];
    // place the player
    this.mainService.placingOdd(playerExtract);
  }
}
