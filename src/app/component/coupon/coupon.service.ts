import { Injectable } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { BetCouponGroup, BetCouponOdd, CancelCouponRequest, CancelCouponResponse, CouponCategory, CouponType, ElysApiService, FlagAsPaidRequest, FlagAsPaidResponse, StagedCouponStatus, ColoursMultiSelectionCouponRequest } from '@elys/elys-api';
// tslint:disable-next-line:max-line-length
import { AddColoursNumberRequest, AddNumberRequest, AddOddRequest, AddOddRequestSC, BetCouponOddExtended, CouponServiceMessageType, ElysCouponService, MessageSource, ColoursMultiSelection } from '@elys/elys-coupon';
import { Observable, Subject, timer } from 'rxjs';
import { AppSettings } from '../../../../src/app/app.settings';
import { LAYOUT_TYPE } from '../../../environments/environment.models';
import { SmartCodeType, TypeBetSlipColTot } from '../../products/main/main.models';
import { BetOdd, CouponConfirmDelete, PolyfunctionalArea } from '../../products/products.model';
import { UserService } from '../../services/user.service';
import { CouponLimit, Error, InternalCoupon, OddsStakeEdit, StakesDisplay } from './coupon.model';
import { PrintCouponService } from './print-coupon/print-coupon.service';

@Injectable()
export class CouponService {
  private messageType: typeof CouponServiceMessageType = CouponServiceMessageType;
  // coupon cache
  coupon: InternalCoupon = null;
  couponIdAdded: number[] = [];

  private couponResponseSubject: Subject<InternalCoupon>;
  couponResponse: Observable<InternalCoupon>;
  // calculate stake and winning max
  stakeDisplay: StakesDisplay = { TotalStake: 0, MaxWinning: 0 };
  stakeDisplaySubject: Subject<StakesDisplay>;
  stakeDisplayObs: Observable<StakesDisplay>;

  // edit Odds Stake
  oddStakeEdit: OddsStakeEdit;
  oddStakeEditSubject: Subject<OddsStakeEdit>;
  oddStakeEditObs: Observable<OddsStakeEdit>;

  // Coupon messages variables
  warningMessage: string;
  error: Error;
  // Variable to show/hide coupon loading message
  isWaitingConclusionOperation: boolean;
  // Variable to show/hide coupon success message
  isASuccess: boolean;
  // Duration of the notification of timed messages
  notificationInterval = 1500;
  // In case of lucky multiple insertion wait till the end before enabling bet button
  public processingOddsQueue: boolean = false;

  productHasCoupon: CouponConfirmDelete;

  // Information coupon when has been placed
  private couponHasBeenPlacedSub: Subject<boolean>;
  couponHasBeenPlacedObs: Observable<boolean>;

  constructor(
    public elysCoupon: ElysCouponService,
    public userService: UserService,
    public printCoupon: PrintCouponService,
    public elysApi: ElysApiService,
    private appSetting: AppSettings
  ) {
    // Initialize the observable to broadcast the coupon placement
    this.couponHasBeenPlacedSub = new Subject<boolean>();
    this.couponHasBeenPlacedObs = this.couponHasBeenPlacedSub.asObservable();

    this.couponResponseSubject = new Subject<InternalCoupon>();
    this.couponResponse = this.couponResponseSubject.asObservable();

    this.elysCoupon.couponConfig.userId = userService.dataUserDetail.userDetail ? userService.dataUserDetail.userDetail.UserId : undefined;
    elysCoupon.couponHasChanged.subscribe(coupon => {
      this.coupon = coupon;

      if (coupon) {
        // check If coupon is Lottery
        if (this.appSetting.products.find(prod => prod.layoutProducts.type === LAYOUT_TYPE.KENO && prod.productSelected)) {
          this.coupon.internal_isLottery = true;
        }
        // check If coupon is Colours
        if (this.appSetting.products.find(prod => prod.layoutProducts.type === LAYOUT_TYPE.COLOURS && prod.productSelected)) {
          this.coupon.internal_isColours = true;
        }
        // check If coupon is Lottery
        if (this.appSetting.products.find(prod => prod.layoutProducts.type === LAYOUT_TYPE.AMERICANROULETTE && prod.productSelected)) {
          this.coupon.internal_isAmericanRoulette = true;
        }
        this.coupon.internal_isReadyToPlace = false;

        if (!this.userService.isLoggedOperator()) {
          this.coupon.BettorId = this.userService.dataUserDetail.operatorDetail.ClientId;
          this.coupon.ClientBettorId = this.userService.dataUserDetail.operatorDetail.ClientId;
        }
        this.couponResponseSubject.next(coupon);
        this.calculateAmounts();
      } else {
        this.resetCoupon();
      }

    });
    // Get the message from the coupon
    elysCoupon.couponServiceMessage.subscribe(message => {
      this.isASuccess = false;
      this.error = undefined;
      this.warningMessage = undefined;
      this.isWaitingConclusionOperation = false;
      // Get coupon's message
      switch (message.messageType) {
        case this.messageType.success:
          // Take only the success message on coupon placement
          if (message.messageSource === MessageSource.COUPON_PLACEMENT) {
            // Show the loading message
            this.isWaitingConclusionOperation = true;
          }
          break;
        case this.messageType.error:
          this.error = new Error(message.message, message.messageSource);
          break;
        case this.messageType.warning:
          this.warningMessage = message.message;
          // Check the coupon's limits
          this.checkLimits();
          // Set the visualization time of the warning
          timer(this.notificationInterval).subscribe(() => (this.warningMessage = undefined));
          break;
        default:
          // Check the coupon's limits
          this.checkLimits();
      }
    });
    this.stakeDisplaySubject = new Subject<StakesDisplay>();
    this.stakeDisplayObs = this.stakeDisplaySubject.asObservable();
    this.stakeDisplayObs.subscribe(elem => (this.stakeDisplay = elem));
    // oddstakeEdit
    this.oddStakeEditSubject = new Subject<OddsStakeEdit>();
    this.oddStakeEditObs = this.oddStakeEditSubject.asObservable();
    this.oddStakeEditObs.subscribe(item => {
      if (this.coupon && this.coupon.hasOwnProperty('internal_isReadyToPlace') && this.coupon.internal_isReadyToPlace !== null) {
        this.oddStakeEdit = item;
      }
    });

    // Check the placement status of the coupon
    elysCoupon.stagedCouponObs.subscribe(async coupons => {
      /* For the rules were adopted on coupon placement (only a coupon at a time can be place)
       * the staged coupon array can contain maximum an element.
       */
      // Set the message to show according with the stagedCouponStatus
      switch (coupons[0].CouponStatusId) {
        // Success on bet
        case StagedCouponStatus.Placed:
          // Remove the loading message
          this.isWaitingConclusionOperation = false;
          // Set the success messageRefusedToRefund,
          this.isASuccess = true;
          // Remove the message
          timer(this.notificationInterval).subscribe(() => (this.isASuccess = false));
          break;
        // Failure on bet
        case StagedCouponStatus.Canceled:
        case StagedCouponStatus.Refunded:
        case StagedCouponStatus.RefusedToRefund:
        case StagedCouponStatus.Unknown:
          // Remove the loading message
          this.isWaitingConclusionOperation = false;
          this.error = new Error('StagedCouponStatus.' + StagedCouponStatus[coupons[0].CouponStatusId], MessageSource.COUPON_PLACEMENT);
          break;
      }
    });

    // Enable back bet button when the coupon finished processing the odd queue
    this.elysCoupon.couponBidProcessed.subscribe(() => this.processingOddsQueue = false);
  }

  addRemoveToCouponSC(smart: PolyfunctionalArea): void {
    // Disable bet while the coupon is processing the queue
    this.processingOddsQueue = true;
    try {
      if (this.coupon && this.coupon.internal_isReadyToPlace) {
        return;
      }
      if (smart) {
        const val: string = smart.value.toString().replace('-', '');
        const amount = smart.typeSlipCol === TypeBetSlipColTot.COL ? smart.amount : smart.amount / smart.odds.length;
        const req: AddOddRequestSC = {
          cCat: CouponCategory.Virtual,
          colAmount: amount,
          smc: smart.smartBetCode,
          shortcut: SmartCodeType[smart.shortcut] + val
        };
        this.elysCoupon.manageOddSC(req);
        this.processingOddsQueue = false;
      }
    } catch (err) { }
  }

  addRemoveToCoupon(smart: BetOdd[], isMultiStake: boolean = true): void {
    // Disable bet while the coupon is processing the queue
    this.processingOddsQueue = true;
    try {
      if (this.coupon && this.coupon.internal_isReadyToPlace) {
        return;
      }
      if (smart) {
        for (const bet of smart.filter(item => item.selected)) {
          let addBoolean = true;
          // check if the coupon is ready
          if (this.coupon && this.coupon.Odds) {
            this.coupon.Odds.filter((odd) => {
              if (odd.SelectionId === bet.id) {
                addBoolean = false;
              }
            });
          }

          // add or remove the id to couponIdAdded
          if (addBoolean) {
            this.couponIdAdded.push(bet.id);
          } else {
            this.couponIdAdded.filter((item, idx) => {
              if (item === bet.id) {
                this.couponIdAdded.splice(idx, 0);
              }
            });
          }

          const addOddRequest: AddOddRequest = this.requestObj(bet, addBoolean, isMultiStake);
          this.elysCoupon.manageOdd(addOddRequest);
          this.processingOddsQueue = false;
        }
      }
    } catch (e) {
      //
      console.log('Error COUPON SERVICE ---> addRemoveToCoupon: ', e);
    }
  }

  /**
   * LOTTERY KENO ADD NUMBER TO COUPON
   * @param eventId
   * @param selectedNumber
   */
  addToRemoveToCouponLottery(eventId: number, selectedNumber: number, amount?: number): void {
    // Disable bet while the coupon is processing the queue
    this.processingOddsQueue = true;
    if (this.coupon && this.coupon.internal_isReadyToPlace) {
      return;
    }
    const req: AddNumberRequest = {
      id: eventId,
      number: selectedNumber,
      amount: amount
    };
    const hasNumber = (this.coupon && this.coupon.Odds) ?
      this.coupon.Odds.find(item => item.SelectionName === selectedNumber.toString()) : false;
    if (hasNumber) {
      req.isDelete = true;
      this.couponIdAdded.push(selectedNumber);
      if (this.coupon.Odds.length === 1) {
        this.resetCoupon();
        return;
      }
    } else {

      this.couponIdAdded.filter((item, idx) => {
        if (item === selectedNumber) {
          this.couponIdAdded.splice(idx, 0);
        }
      });
    }
    this.elysCoupon.manageOddLottery(req);
  }

  /**
 * COLOURS ADD NUMBER TO COUPON
 * @param eventId
 * @param selectedNumber
 */
  addToRemoveToCouponColours(selectionId: number, outcomeType: string, outcome: string, amount: number): void {
    // Disable bet while the coupon is processing the queue
    this.processingOddsQueue = true;
    if (this.coupon && this.coupon.internal_isReadyToPlace) {
      return;
    }
    const req: AddColoursNumberRequest = {
      id: selectionId,
      outcomeType: outcomeType,
      outcome: outcome.replace('+', ''),
      amount: amount
    };
    const hasNumber = (this.coupon && this.coupon.Odds) ?
      this.coupon.Odds.find(item => item.SelectionName === outcome) : false;
    if (hasNumber) {
      req.isDelete = true;
      this.couponIdAdded.push(Number(outcome));
      if (this.coupon.Odds.length === 1) {
        this.resetCoupon();
        return;
      }
    } else {

      this.couponIdAdded.filter((item, idx) => {
        if (item === Number(outcome)) {
          this.couponIdAdded.splice(idx, 0);
        }
      });
    }
    this.elysCoupon.manageOddColours(req);
  }

  multiAddToCouponColours(selectionId: number, outcomeType: string, outcomes: string[], amount: number): void {
    // Disable bet while the coupon is processing the queue
    this.processingOddsQueue = true;
    const req: ColoursMultiSelection = {
      selectionId: selectionId,
      outcomeType: outcomeType,
      outcomes: outcomes,
      amount: amount
    };
    this.elysCoupon.manageColoursMultiOddSC(req);
  }

  private requestObj(bet: BetOdd, isAdd: boolean = true, isMultipleStake): AddOddRequest {
    return {
      cCat: CouponCategory.Virtual,
      oddId: bet.id,
      selid: bet.id,
      add: isAdd,
      colAmount: bet.amount,
      isMultipleStake: isMultipleStake
    };
  }

  // Clear all odds to notificationInterval
  resetCoupon(): void {
    this.coupon = null;
    this.couponIdAdded = [];
    this.elysCoupon.betCoupon = null;
    // Reset message's variable
    this.error = undefined;
    this.warningMessage = undefined;
    // Reset amount
    const stakesDisplayTemp: StakesDisplay = {
      TotalStake: 0,
      MaxWinning: 0
    };
    this.couponHasBeenPlacedSub.next(true);
    this.stakeDisplaySubject.next(stakesDisplayTemp);
  }

  /**
   * calculate stake and winning max
   */
  calculateAmounts(): void {
    let stake = 0,
      totalWin = 0;
    if (this.appSetting.products.filter(prod => prod.productSelected)[0].typeCoupon.acceptMultiStake) {
      // The coupon has multipleStake
      this.coupon.Odds.forEach(odd => {
        stake += odd.OddStake;
      });
      // Updated the grouping
      this.coupon.Groupings.map(item => {
        if (!item.IsMultiStake && item.Selected) {
          item.Stake = stake / item.Combinations;
          item.MaxWinCombination = item.Stake * item.MaxWinCombinationUnit;
        }
        totalWin += item.Stake * item.MaxWinCombinationUnit;
      });
    } else {
      this.coupon.Groupings.forEach(grouping => {
        if (grouping.Selected && !grouping.IsMultiStake) {
          stake += grouping.Stake * grouping.Combinations;
          totalWin += grouping.Stake * grouping.MaxWinCombinationUnit;
        }
      });
      this.coupon.Stake = stake;
    }

    const stakesDisplayTemp: StakesDisplay = {
      TotalStake: stake,
      MaxWinning: totalWin
    };

    this.stakeDisplaySubject.next(stakesDisplayTemp);
  }

  updateCoupon(): void {
    if (this.oddStakeEdit && this.coupon) {
      if (this.oddStakeEdit.tempStake > 0 && !this.oddStakeEdit.grouping) {
        this.coupon.Odds[this.oddStakeEdit.indexOdd].OddStake = this.oddStakeEdit.tempStake;
      }
      this.oddStakeEditSubject.next(null);
    }

    if (this.coupon.internal_isLottery) {
      this.elysCoupon.updateCouponLottery(this.coupon);
    } else if (this.coupon.internal_isColours) {
      this.elysCoupon.updateCouponColours(this.coupon);
    } else {
      this.elysCoupon.updateCoupon(this.coupon);
    }
  }

  checkOddToChangeStake(odd: BetCouponOdd): void {
    const tempOdd: OddsStakeEdit = {
      indexOdd: -1,
      tempStake: 0.0,
      odd: null,
      isDefaultInput: false
    };
    // search if the odd is selected and it reset
    if (this.oddStakeEdit && this.oddStakeEdit.odd.SelectionId === odd.SelectionId) {
      this.oddStakeEditSubject.next(null);
      return;
    }
    // filter the odd to coupon and extract the index and value
    this.coupon.Odds.filter((item: BetCouponOddExtended, idx) => {
      if (item.SelectionId === odd.SelectionId) {
        tempOdd.indexOdd = idx;
        tempOdd.odd = item;
      }
    });

    this.oddStakeEditSubject.next(tempOdd);
  }

  //

  checkGroupingToChangeStake(grouping: BetCouponGroup): void {
    const tempOdd: OddsStakeEdit = {
      indexOdd: -1,
      tempStake: 0.0,
      odd: null,
      grouping: null,
      isDefaultInput: false
    };
    // search if the odd is selected and it reset
    if (this.oddStakeEdit && this.oddStakeEdit.grouping.Grouping === grouping.Grouping) {
      this.oddStakeEditSubject.next(null);
      return;
    }
    // filter the odd to coupon and extract the index and value
    this.coupon.Groupings.filter((item: BetCouponGroup, idx) => {
      if (item.Grouping === grouping.Grouping) {
        tempOdd.indexOdd = idx;
        tempOdd.grouping = item;
      }
    });

    this.oddStakeEditSubject.next(tempOdd);
  }

  // Method to execute the coupon limits check.
  checkLimits() {
    // Check if it is a valid coupon
    if (this.coupon && this.coupon.CouponTypeId !== CouponType.Unknown) {
      const couponAcceptMultiStake = this.appSetting.products.filter(product => product.productSelected)[0].typeCoupon.acceptMultiStake;
      // Get the MaxBetStake to verify
      const maxBetStake =
        this.coupon.CouponLimit.MaxBetStake < this.coupon.UserCouponLimit.MaxStake
          ? this.coupon.CouponLimit.MaxBetStake
          : this.coupon.UserCouponLimit.MaxStake;
      let maxBetWin: number;
      const error: Error = new Error();
      // Check the limitation by coupon type
      switch (this.coupon.CouponTypeId) {
        case CouponType.SingleBet:
          // Get the MaxBetWin to verify
          maxBetWin =
            this.coupon.CouponLimit.MaxSingleBetWin < this.coupon.UserCouponLimit.MaxLoss
              ? this.coupon.CouponLimit.MaxSingleBetWin
              : this.coupon.UserCouponLimit.MaxLoss;
          if (this.stakeDisplay.MaxWinning > maxBetWin) {
            // Check the MaxBetWin
            error.setError(CouponLimit[CouponLimit.MaxSingleBetWin], MessageSource.UNKNOWN, maxBetWin);
          } else if (this.coupon.Odds[0].OddStake < this.coupon.CouponLimit.MinBetStake && couponAcceptMultiStake) {
            // Check the MinBetStake
            error.setError(
              CouponLimit[CouponLimit.MinBetStake],
              MessageSource.UNKNOWN,
              this.coupon.CouponLimit.MinBetStake,
              this.coupon.Odds[0].SelectionId
            );
          } else if (this.coupon.Odds[0].OddStake > maxBetStake && couponAcceptMultiStake) {
            // Check the MaxBetStake
            error.setError(CouponLimit[CouponLimit.MaxBetStake], MessageSource.UNKNOWN, maxBetStake, this.coupon.Odds[0].SelectionId);
          } else if (this.coupon.Stake > maxBetStake && !couponAcceptMultiStake) {
            error.setError(CouponLimit[CouponLimit.MaxBetStake], MessageSource.UNKNOWN, maxBetStake, this.coupon.Odds[0].SelectionId);
          } else if (this.coupon.Stake < this.coupon.CouponLimit.MinBetStake && !couponAcceptMultiStake) {
            error.setError(
              CouponLimit[CouponLimit.MinBetStake],
              MessageSource.UNKNOWN,
              this.coupon.CouponLimit.MinBetStake,
              this.coupon.Odds[0].SelectionId
            );
          }
          break;
        case CouponType.MultipleBet:
          if (this.coupon.Stake > maxBetStake && !couponAcceptMultiStake) {
            error.setError(CouponLimit[CouponLimit.MaxBetStake], MessageSource.UNKNOWN, maxBetStake, this.coupon.Odds[0].SelectionId);
          } else if (this.coupon.Stake < this.coupon.CouponLimit.MinBetStake && !couponAcceptMultiStake) {
            error.setError(
              CouponLimit[CouponLimit.MinBetStake],
              MessageSource.UNKNOWN,
              this.coupon.CouponLimit.MinBetStake,
              this.coupon.Odds[0].SelectionId
            );
          }
          break;
        case CouponType.CombinationsBet:
          // Get the MaxBetWin to verify
          maxBetWin =
            this.coupon.CouponLimit.MaxCombinationBetWin < this.coupon.UserCouponLimit.MaxLoss
              ? this.coupon.CouponLimit.MaxCombinationBetWin
              : this.coupon.UserCouponLimit.MaxLoss;
          if (this.stakeDisplay.TotalStake > maxBetStake) {
            // Check the MaxBetStake
            error.setError(CouponLimit[CouponLimit.MaxBetStake], MessageSource.UNKNOWN, maxBetStake);
          } else if (this.stakeDisplay.MaxWinning > maxBetWin) {
            // Check the MaxBetWin
            error.setError(CouponLimit[CouponLimit.MaxCombinationBetWin], MessageSource.UNKNOWN, maxBetWin);
          } else {
            for (const grouping of this.coupon.Groupings) {
              // Check the active groupings
              if (grouping.Selected) {
                // Check if it a system of singles
                const isASystemOfSingle = grouping.Grouping === 1;
                const isMultiStake = grouping.IsMultiStake;
                for (const odd of this.coupon.Odds) {
                  let oddStake: number;
                  // Get the oddStake
                  if (isMultiStake) {
                    oddStake = odd.OddStake;
                  } else {
                    oddStake = grouping.Stake;
                  }
                  // Check the MinGroupingsBetStake
                  if (oddStake < this.coupon.CouponLimit.MinGroupingsBetStake) {
                    // Check if this kind of error has already been created
                    if (error.message === CouponLimit[CouponLimit.MinGroupingsBetStake]) {
                      // Error already present. Add a new location to its array.
                      error.location.push(odd.SelectionId);
                    } else {
                      // Check if any other kind of error is already present
                      if (error.isEmpty()) {
                        // Create the error
                        error.setError(
                          CouponLimit[CouponLimit.MinGroupingsBetStake],
                          MessageSource.UNKNOWN,
                          this.coupon.CouponLimit.MinGroupingsBetStake,
                          odd.SelectionId
                        );
                      }
                    }
                  } else if (oddStake > this.coupon.CouponLimit.MaxGroupingsBetStake) {
                    // Check the MaxGroupingsBetStake
                    if (error.message === CouponLimit[CouponLimit.MaxGroupingsBetStake]) {
                      error.location.push(odd.SelectionId);
                    } else {
                      // Check if any other kind of error is already present
                      if (error.isEmpty()) {
                        // Create the error
                        error.setError(
                          CouponLimit[CouponLimit.MaxGroupingsBetStake],
                          MessageSource.UNKNOWN,
                          this.coupon.CouponLimit.MaxGroupingsBetStake,
                          odd.SelectionId
                        );
                      }
                    }
                  } else if (isASystemOfSingle) {
                    // For a system of singles
                    // Check if the win of the single with the highest odd rispect the limit
                    if (grouping.MaxWinCombination > this.coupon.CouponLimit.MaxSingleBetWin) {
                      const singleWin = oddStake * odd.OddValue;
                      // Check the "MaxSingleBetWin"
                      if (singleWin > this.coupon.CouponLimit.MaxSingleBetWin) {
                        if (error.message === CouponLimit[CouponLimit.MaxSingleBetWin]) {
                          this.error.location.push(odd.SelectionId);
                        } else {
                          // Check if any other kind of error is already present
                          if (error.isEmpty()) {
                            // Create the error
                            error.setError(
                              CouponLimit[CouponLimit.MaxSingleBetWin],
                              MessageSource.UNKNOWN,
                              this.coupon.CouponLimit.MaxSingleBetWin,
                              odd.SelectionId
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          break;
      }
      // Set the error variable if an error has occurerd
      if (!error.isEmpty()) {
        this.error = error;
      }
    }
  }

  /**
   *
   */
  async preStagedCoupon(): Promise<void> {
    if (!this.coupon && this.coupon.Odds.length > 0) {
      return;
    }
    this.isWaitingConclusionOperation = true;
    // Check type coupon and call the different api
    if (this.coupon.internal_isLottery) {
      await this.elysCoupon.updateCouponLottery(this.coupon);
    } else if (this.coupon.internal_isColours) {
      await this.elysCoupon.updateCouponColours(this.coupon);
    } else {
      await this.elysCoupon.updateCoupon(this.coupon);
    }
    // enabled process to staging coupon
    this.coupon.internal_isReadyToPlace = true;
    if (this.appSetting.couponDirectPlace) {
      this.stagedCoupon();
    }
  }

  checkIfCouponIsReadyToPlace(): boolean {
    return this.coupon && this.coupon.internal_isReadyToPlace ? this.coupon.internal_isReadyToPlace : false;
  }

  /**
   *
   */
  cancelStagingCoupon(): void {
    this.coupon.internal_isReadyToPlace = false;
  }

  stagedCoupon(): void {
    // Check type coupon and call the different api
    if (this.coupon.internal_isLottery) {
      this.elysCoupon.placeCouponLottery(this.coupon);
    } else if (this.coupon.internal_isColours) {
      this.elysCoupon.placeCouponColours(this.coupon);
    } else {
      this.elysCoupon.placeCoupon(this.coupon);
    }
  }

  /**
   * Method to make the payment of a coupon
   * @param request Request object
   */
  flagAsPaidCoupon(request: FlagAsPaidRequest): Promise<FlagAsPaidResponse> {
    try {
      return this.elysApi.coupon.flagAsPaidCoupon(request);
    } catch (err) {
      throw err.error.error_description;
    }
  }

  /**
   * Method to cancel a coupon
   * @param request Request object
   */
  cancelCoupon(request: CancelCouponRequest): Promise<CancelCouponResponse> {
    try {
      return this.elysApi.coupon.cancelCoupon(request);
    } catch (err) {
      throw err.statusText;
    }
  }

  checkHasCoupon(): void {
    if (this.coupon) {
      this.productHasCoupon.checked = true;
    } else {
      this.productHasCoupon.checked = false;
    }
  }

  resetProductHasCoupon(): void {
    this.productHasCoupon = {
      checked: false,
      productCodeRequest: '',
      isRacing: false,
      eventNumber: 0
    };
  }
}
