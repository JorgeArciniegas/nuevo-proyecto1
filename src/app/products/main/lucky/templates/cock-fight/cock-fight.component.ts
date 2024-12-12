import { Component } from '@angular/core';
import { VirtualBetEvent } from '@elys/elys-api';
import { Subscription } from 'rxjs';
import { UserService } from '../../../../../services/user.service';
import { Market } from '../../../../products.model';
import { MainService } from '../../../main.service';
import { Lucky } from '../../lucky.model';

@Component({
  selector: 'app-lucky-cock-fight',
  templateUrl: './cock-fight.component.html',
  styleUrls: ['./cock-fight.component.scss']
})
export class CockFightComponent {
  public market: typeof Market = Market;

  lucky: typeof Lucky = Lucky;
  /**
   * contains "winning" selections
   */
  winModel = [];
  /**
   * contains "winning + o/u" selections
   */
  ouWinModel = [];
  /**
   * contains "winning + sector" selections
   */
  sectorWinModel = [];
  /**
   * store the previous lucky selection
   */
  oldLuckyCock = 0;
  /**
   * switch to detect if the event is changed, if so, reload currentEvent
   */
  private isNewEvent = true;
  evtChangeSubscription: Subscription;
  private currentEvent: VirtualBetEvent;
  constructor(private userService: UserService, private mainService: MainService) {
    this.evtChangeSubscription = this.mainService.currentEventSubscribe.subscribe(event => {
      /**
       * listen to event change
       */
      this.isNewEvent = true;
      this.oldLuckyCock = 0;
    });
  }

  async placingLucky(lucky: Lucky): Promise<void> {
    this.mainService.resetPlayEvent();
    /**
     * when a lucky button is clicked check if the event is changed, if it is, currentEvent is populated with new data and
     * the market selection containers are refreshed
     */
    if (this.isNewEvent) {
      // code inside this if is executed only when a new event is loaded

      // reset market selections containers
      this.winModel = [];
      this.ouWinModel = [];
      this.sectorWinModel = [];
      this.currentEvent = await this.mainService.getCurrentEvent();
      this.currentEvent.mk.forEach(eventMarkets => {
        const correctSelections = eventMarkets.sls.filter(item => item.ods[0].vl > 0);

        /**
         * populates market selection containers by market type
         */
        switch (eventMarkets.tp) {
          case this.market['1X2']: // winner
            correctSelections.forEach(marketSelections => {
              this.winModel.push(marketSelections);
            });
            break;
          case this.market['1X2OverUnder']: // winner + o/u
            correctSelections.forEach(marketSelections => {
              // exclude X + O/U
              if (marketSelections.tp !== 3) {
                this.ouWinModel.push(marketSelections);
              }
            });
            break;
          case this.market['1X2WinningSector']: // winner + sector
            correctSelections.forEach(marketSelections => {
              if (marketSelections.nm !== 'X + S0') {
                this.sectorWinModel.push(marketSelections);
              }
            });
            break;
        }
      });
      this.isNewEvent = false;
    }
    /**
     * code below is always executed when a lucky button is clicked.
     * Selects the lucky selection from the market selections container, choosed by clicking "Lucky 1", "Lucky 2" or "Lucky 3"
     * and pick up the lucky selection depending on the RNG
     */
    const currentSelection = { tp: 0, selection: null };
    let limit = 0;
    switch (lucky) {
      case 1:
        limit = this.winModel.length;
        currentSelection.selection = this.winModel[this.RNGLuckyCock(limit)];
        currentSelection.tp = this.market['1X2'];
        break;
      case 2:
        limit = this.ouWinModel.length;
        currentSelection.selection = this.ouWinModel[this.RNGLuckyCock(limit)];
        currentSelection.tp = this.market['1X2OverUnder'];
        break;
      case 3:
        limit = this.sectorWinModel.length;
        currentSelection.selection = this.sectorWinModel[this.RNGLuckyCock(limit)];
        currentSelection.tp = this.market['1X2WinningSector'];
        break;
    }

    /**
     * check whether there is available odds
     */
    if(limit === 0) {
      return;
    }

    /**
     * check if the current selection is equal to the previous
     */
    if (this.oldLuckyCock === 0 || this.oldLuckyCock !== currentSelection.selection.id || limit === 1) {
      this.oldLuckyCock = currentSelection.selection.id;
      /**
       * places the selection on the main service
       */
      this.mainService.placingOddByOdd(currentSelection.tp, currentSelection.selection);
    } else {
      this.placingLucky(lucky);
    }
  }
  /**
   * @param limit is the max limit for the RNG
   * 1 on 3 for market "Winner"
   * 1 on 4 for market "Winner + O/U"
   * 1 on 8 for market "Winner + Sector"
   */
  RNGLuckyCock(limit: number): number {
    const extractNumber: number = Math.floor(Math.random() * limit);
    return extractNumber;
  }
}
