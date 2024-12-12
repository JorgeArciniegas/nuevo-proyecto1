import { Injectable, OnDestroy } from '@angular/core';
import { VirtualBetSelection } from '@elys/elys-api';
import { MainService } from '../../../main.service';
import { VirtualBetTournamentExtended, Match } from '../../../main.models';
import { Subscription, timer } from 'rxjs';
import { BtncalcService } from '../../../../../component/btncalc/btncalc.service';
import { ElysCouponService, BetCouponExtended } from '@elys/elys-coupon';
import { CouponService } from '../../../../../component/coupon/coupon.service';

@Injectable()
export class SoccerService implements OnDestroy {
  public tournament: VirtualBetTournamentExtended;
  // Index of the match array of the selected match;
  public selectedMatch: number;
  // Index of the areas array of the selected match;
  public selectedArea: number;
  private currentEventSubscription: Subscription;
  // Listen the coupon's change
  couponHasChangedSubscription: Subscription;
  couponHasBeenPlacedSubscription: Subscription;

  // list of odds currently being elaborated by the coupon library
  public oddsInProcessing: number[] = [];

  isCheckedCoupon: boolean;
  timerCheckedSelectionSub: Subscription;
  constructor(
    private mainService: MainService,
    private btnCalcService: BtncalcService,
    private elysCoupon: ElysCouponService,
    public couponService: CouponService
  ) {
    // Variables inizialization.
    this.selectedMatch = -1;
    // Set the default Area "Main".
    this.selectedArea = 0;

    // Get the event's detail at the access of the section
    this.getTournamentDetails();
  }

  verifySelectedOdds(coupon: BetCouponExtended): void {
    const couponOdds: number[] = coupon.Odds.map(x => x.SelectionId);
    this.tournament.matches.forEach(match => {
      match.selectedOdds.forEach((x, idx) => {
        if (!couponOdds.includes(x)) {
          match.selectedOdds.splice(idx);
          this.oddsInProcessing.splice(this.oddsInProcessing.indexOf(x));
        }
      });
      if (match.selectedOdds.length === 0) {
        match.hasOddsSelected = false;
      }
    });

    coupon.Odds.forEach(odd => {
      const match: Match = this.tournament.matches.filter(x => x.id === odd.MatchId)[0];
      if (!match.selectedOdds.includes(odd.SelectionId)) {
        match.selectedOdds.push(odd.SelectionId);
        match.hasOddsSelected = true;
      }

      if (match.selectedOdds.length > 0) {
        match.hasOddsSelected = true;
      }
    });
    const oddProcessed: number = couponOdds.filter(odd => this.oddsInProcessing.indexOf(odd) < 0)[0];
    this.oddsInProcessing = this.oddsInProcessing.filter(x => x === oddProcessed);
  }

  ngOnDestroy() {
    this.destroySubscriptions();
  }

  subscribeToObservables() {
    // Get the event's details.
    this.currentEventSubscription = this.mainService.currentEventObserve.subscribe(() => {
      this.getTournamentDetails();
    });

    // Remove selected odd when delete all Selection from coupon.
    this.couponHasBeenPlacedSubscription = this.couponService.couponHasBeenPlacedObs.subscribe(b => {
      if (b && this.tournament && this.tournament.matches) {
        this.tournament.matches.forEach(match => {
          if (match.hasOddsSelected) {
            match.hasOddsSelected = false;
            match.selectedOdds = [];
          }
        });
      }
    });

    // Get the change of the coupon's object.
    this.couponHasChangedSubscription = this.elysCoupon.couponHasChanged.subscribe(coupon => {
      if (coupon) {
        this.verifySelectedOdds(coupon);
      } else {
        this.oddsInProcessing = [];
        // The coupon was removed.
        this.tournament.matches.map(match => {
          if (match.hasOddsSelected) {
            match.hasOddsSelected = false;
            match.selectedOdds = [];
          }
        });
      }
    });
  }

  destroySubscriptions() {
    this.currentEventSubscription.unsubscribe();
    this.couponHasChangedSubscription.unsubscribe();
    this.couponHasBeenPlacedSubscription.unsubscribe();
  }

  /**
   * Method to get the details of the currently selected tournament (week).
   * @param attemptsNumber The number of attempted call executed. Limit of attempts is 5 recall.
   */
  getTournamentDetails(attemptsNumber: number = 0): void {
    // Reset variables.
    // Reset the default Area to "Main".
    if (this.selectedArea !== 0) {
      this.changeArea(0);
    }
    // Deselect the match if any it is selected
    if (this.selectedMatch !== -1) {
      this.openEventDetails(this.selectedMatch);
    }

    this.mainService
      .getCurrentTournament()
      .then(tournamentDetails => {
        this.tournament = tournamentDetails;
        // check odds selected
        if (this.couponService.productHasCoupon) {
          if (this.couponService.coupon) {
            this.couponService.coupon.Odds.filter(odd => {
              const match: Match = this.tournament.matches.filter((item) => item.name === odd.DefaultEventName)[0];
              match.hasOddsSelected = true;
              match.selectedOdds.push(odd.SelectionId);
            });
          }
        }
      })
      .catch(error => {
        // Limit of attempts is 5 recall.
        if (attemptsNumber < 5) {
          timer(5000).subscribe(() => this.getTournamentDetails(attemptsNumber + 1));
        }
      });

  }

  // Method to open the details of the selected match
  openEventDetails(matchIndex: number): void {
    this.tournament.matches[matchIndex].isDetailOpened = !this.tournament.matches[matchIndex].isDetailOpened;

    // Reset the default Area to "Main".
    if (this.selectedArea !== 0) {
      this.changeArea(0);
    }
    // Check if the match details is already open.
    if (this.selectedMatch === matchIndex) {
      // Remove the selected match.
      this.selectedMatch = -1;
    } else if (this.selectedMatch !== matchIndex && this.selectedMatch === -1) {
      // Set the new open match.
      this.selectedMatch = matchIndex;
    } else {
      // Change the status of the match whoes detail was open
      this.tournament.matches[this.selectedMatch].isDetailOpened = !this.tournament.matches[this.selectedMatch].isDetailOpened;
      // Set the new open match.
      this.selectedMatch = matchIndex;
    }
  }

  // Method to show the selected area. In case the button is already selected no operations will be execute.
  changeArea(areaIndex: number): void {
    // Operate only if the area is not selected yet.
    if (this.selectedArea !== areaIndex) {
      // Change status of the current area.
      // tslint:disable-next-line:max-line-length
      this.tournament.listDetailAreas[this.selectedMatch][this.selectedArea].isSelected = !this.tournament.listDetailAreas[
        this.selectedMatch
      ][this.selectedArea].isSelected;
      // Change status of the newly selected area.
      // tslint:disable-next-line:max-line-length
      this.tournament.listDetailAreas[this.selectedMatch][areaIndex].isSelected = !this.tournament.listDetailAreas[this.selectedMatch][
        areaIndex
      ].isSelected;
      this.selectedArea = areaIndex;
    }
  }

  selectOdd(marketId: number, selection: VirtualBetSelection): void {
    if (this.oddsInProcessing.includes(selection.id)) {
      return;
    }
    this.oddsInProcessing.push(selection.id);
    this.mainService.placingOddByOdd(marketId, selection);
    // tap su plus automatico
    this.btnCalcService.tapPlus();
  }
}
