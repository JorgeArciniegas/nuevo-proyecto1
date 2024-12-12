import { Component, Input, OnDestroy } from '@angular/core';
import { MainService } from '../../../main.service';
import { VirtualBetEvent, VirtualBetSelection } from '@elys/elys-api';
import { Subscription, timer } from 'rxjs';
import { Market, PolyfunctionalArea } from '../../../../../products/products.model';
import { SpecialBet } from '../../../main.models';
import { ProductsService } from '../../../../../products/products.service';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-playable-board-cock-fight',
  templateUrl: './cock-fight.component.html',
  styleUrls: ['./cock-fight.component.scss']
})
export class CockFightComponent implements OnDestroy {
  @Input()
  public rowHeight: number;
  public eventDetails: VirtualBetEvent;
  public marketEnum: typeof Market = Market;
  public specialBet: typeof SpecialBet = SpecialBet;
  // List of visible markets on the template. The index of the array is taken to show them on the different rows of the template.
  public shownMarkets: Market[];
  private currentEventSubscription: Subscription;
  private polyfunctionalAreaSubscription: Subscription;
  // List of odds selected.
  public oddsSelected: number[];

  constructor(public mainService: MainService, public productService: ProductsService, public userService: UserService) {
    this.oddsSelected = [];
    // Get the setting information on the order to show the market on the template.
    this.shownMarkets = this.productService.product.layoutProducts.shownMarkets;
    // Get the event's detail at the access of the section
    this.getEventDetails();

    // Get the event's details.
    this.currentEventSubscription = this.mainService.currentEventObserve.subscribe(() => {
      this.getEventDetails();
    });

    // Get the change of the polyfunctional area's object.
    this.polyfunctionalAreaSubscription = this.productService.polyfunctionalAreaObservable.subscribe(polyfunctional => {
      // Delete the list of selections when the object of polyfunctional area is empty.
      if (polyfunctional.odds.length === 0 && this.oddsSelected.length !== 0) {
        this.oddsSelected = [];
      } else {
        this.checkOddSelected(polyfunctional);
      }
    });
  }

  ngOnDestroy() {
    this.currentEventSubscription.unsubscribe();
    this.polyfunctionalAreaSubscription.unsubscribe();
  }

  /**
   * Method to get the details of the currently selected event.
   * @param attemptsNumber The number of attempted call executed. Limit of attempts is 5 recall.
   */
  getEventDetails(attemptsNumber: number = 0) {
    this.mainService
      .getCurrentEvent()
      .then(eventDetails => {
        this.eventDetails = eventDetails;
      })
      .catch(error => {
        // Limit of attempts is 5 recall.
        if (attemptsNumber < 5) {
          timer(1000).subscribe(() => this.getEventDetails(attemptsNumber + 1));
        } else {
          console.log(error);
        }
      });
  }

  selectOdd(marketId: number, selection: VirtualBetSelection) {
    const index = this.oddsSelected.indexOf(selection.id);
    // Insert or delete the selection from the list.
    if (index === -1) {
      this.oddsSelected.push(selection.id);
    } else {
      this.oddsSelected.splice(index, 1);
    }
    this.mainService.placingOddByOdd(marketId, selection);
  }

  /**
   * When "oddsSelected" does not have the odds contains from "polifunctionalArea", append it.
   * @param polyfunctional PolyfunctionalArea
   */
  private checkOddSelected(polyfunctional: PolyfunctionalArea): void {
    polyfunctional.odds.filter(item => {
      if (!this.oddsSelected.includes(item.id)) {
        this.oddsSelected.push(item.id);
      }
    });
  }

  // Method used only on native template.
  getColumnsString(colNum: number): string {
    let colDefiner = '*';
    for (let i = 1; i < colNum; i++) {
      colDefiner += ',*';
    }
    return colDefiner;
  }
}
