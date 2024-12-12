import { Injectable } from '@angular/core';
import { ElysApiService, VirtualProgramTreeBySportRequest, VirtualBetEvent, VirtualBetMarket, VirtualBetSelection, VirtualBetTournament, VirtualDetailOddsOfEventResponse, VirtualEventCountDownRequest, VirtualEventCountDownResponse, VirtualGetRankByEventResponse, VirtualProgramTreeBySportResponse, PlaySource } from '@elys/elys-api';
import { ElysFeedsService } from '@elys/elys-feeds';
import { cloneDeep as clone } from 'lodash';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { LAYOUT_TYPE } from '../../../environments/environment.models';
import { BtncalcService } from '../../component/btncalc/btncalc.service';
import { DestroyCouponService } from '../../component/coupon/confirm-destroy-coupon/destroy-coupon.service';
import { CouponService } from '../../component/coupon/coupon.service';
import { UserService } from '../../services/user.service';
import { BetOdd, Market, PolyfunctionalArea, PolyfunctionalStakeCoupon, SelectionIdentifier } from '../products.model';
import { ProductsService } from '../products.service';
import { ColourGameId } from './colour-game.enum';
import { Area, CombinationType, EventDetail, EventInfo, EventTime, ListArea, Match, PlacingEvent, Player, Podium, Smartcode, SmartCodeType, SpecialBet, SpecialBetValue, SpecialOddData, TypeBetSlipColTot, TypePlacingEvent, VirtualBetEventExtended, VirtualBetMarketExtended, VirtualBetSelectionExtended, VirtualBetTournamentExtended } from './main.models';
import { KenoNumber } from './playable-board/templates/keno/keno.model';
import { ResultsService } from './results/results.service';
import { areas, overviewAreas } from './SoccerAreas';

@Injectable()
export class MainService {
  private cacheEvents: VirtualBetEvent[] = [];
  private cacheTournaments: VirtualBetTournamentExtended[] = [];
  // Working variable
  public remainingTime: EventTime = new EventTime();
  placingEvent: PlacingEvent = new PlacingEvent();
  public currentEventDetails: VirtualBetEvent;
  public currentProductDetails: VirtualBetTournamentExtended;

  public selectedColourGameId: ColourGameId = ColourGameId.bet49;

  private remaingTimeCounter: Subject<EventTime>;
  public remaingTimeCounterObs: Observable<EventTime>;

  private attempts = 0;
  public initCurrentEvent = false;
  playersList: Player[];

  smartCode: Smartcode;

  amount: number;

  countdownSub: Subscription;


  public currentEventSubscribe: Subject<number>;
  public currentEventObserve: Observable<number>;
  public eventDetails: EventDetail;
  /**
   * set to reset all variables
   * When it is true, clear the polyfunctionalArea, Coupon and playboard
   * */
  public toResetAllSelections: boolean;


  constructor(
    private elysApi: ElysApiService,
    private productService: ProductsService,
    private btnService: BtncalcService,
    public couponService: CouponService,
    public destroyCouponService: DestroyCouponService,
    private resultService: ResultsService,
    private feedData: ElysFeedsService,
    private userservice: UserService
  ) {

    this.toResetAllSelections = true;

    this.createPlayerList();

    // counter obser
    this.remaingTimeCounter = new Subject<EventTime>();
    this.remaingTimeCounterObs = this.remaingTimeCounter.asObservable();

    this.productService.productNameSelectedObserve.subscribe(item => {
      if (!this.couponService.productHasCoupon.checked) {
        this.cacheEvents = [];
        this.cacheTournaments = [];
        this.initEvents();
      }
    });



    this.currentEventSubscribe = new Subject<number>();
    this.currentEventObserve = this.currentEventSubscribe.asObservable();

    this.currentEventObserve.subscribe((eventIndex: number) => {
      this.eventDetails.currentEvent = eventIndex;
      this.remainingEventTime(this.eventDetails.events[eventIndex].number).then((eventTime: EventTime) => {
        if (eventTime) {
          this.eventDetails.eventTime = eventTime;
          if (this.eventDetails.currentEvent === 0) {
            this.remainingTime.minute = eventTime.minute;
            this.remainingTime.second = eventTime.second;
          }
        }
      });

      if (this.toResetAllSelections) {
        // Reset coupon
        this.couponService.resetCoupon();
        // Reset playable board
        this.resetPlayEvent();
      }

      // Get event's odds
      this.eventDetailOdds(this.eventDetails.events[eventIndex].number);
    });

    this.productService.playableBoardResetObserve.subscribe(reset => {
      if (reset) {
        this.toResetAllSelections = true;
        timer(500).subscribe(() => this.resetPlayEvent());
        // Resume event's countdown
        this.resumeCountDown();
      }
    });

  }

  /**
   * Used on component
   */
  destroy() {
    if (!this.countdownSub.closed) {
      this.countdownSub.unsubscribe();
    }
    this.initCurrentEvent = true;
    this.cacheEvents = [];
    this.cacheTournaments = [];
  }

  /**
   *
   */
  resumeCountDown() {
    if (this.countdownSub && this.countdownSub.closed || !this.countdownSub) {
      this.currentAndSelectedEventTime();
      this.countdownSub = timer(1000, 1000).subscribe(() => this.getTime());
    }
  }

  /**
   * the system set the the default product first application launch.
   * it's managed by environment file and it returns the product marked "productSelected"
   */
  initEvents(): void {
    this.initCurrentEvent = true;
    this.selectedColourGameId = ColourGameId.bet49;

    this.eventDetails = new EventDetail(this.productService.product.layoutProducts.nextEventItems);
    this.eventDetails.currentEvent = 0;

    this.loadEvents();
  }

  createPlayerList(): void {
    this.playersList = [];
    for (const i of [1, 2, 3]) {
      for (const d of [1, 2, 3, 4, 5, 6]) {
        const player: Player = new Player();
        player.number = d;
        player.position = i;
        this.playersList.push(player);
      }
    }
  }

  getTime(): void {
    try {
      // when countdown is stopped, it doesn't load the new data
      if (this.countdownSub.closed) {
        return;
      }
      if (this.remainingTime.second === 0 && this.remainingTime.minute === 0 || !this.userservice.isUserLogged) {
        // stop the countdown to prevent multiple calls
        this.countdownSub.unsubscribe();
        this.loadEvents();
      } else {
        if (this.remainingTime.second < 0 || this.remainingTime.minute < 0) {
          // stop the countdown to prevent multiple calls
          this.countdownSub.unsubscribe();
          // If remaining time is negative there is an error, reload all.
          this.cacheEvents = [];
          this.cacheTournaments = [];
          this.loadEvents();
          return;
        }
        if (this.remainingTime.second === 0 && this.remainingTime.minute > 0) {
          // Remaing time
          this.remainingTime.second = 59;
          this.remainingTime.minute = this.remainingTime.minute - 1;
          // Remaing shown time
          this.eventDetails.eventTime.minute = this.eventDetails.eventTime.minute - 1;
        } else {
          // Remaing time
          this.remainingTime.second = this.remainingTime.second - 1;
          // Check time blocked
          if (this.eventDetails.eventTime.second <= 10 && this.eventDetails.eventTime.minute === 0) {
            this.placingEvent.timeBlocked = true;
            this.productService.closeProductDialog();
          } else {
            this.placingEvent.timeBlocked = false;
          }
        }
        // Shown seconds
        this.eventDetails.eventTime.second = this.remainingTime.second;
        this.remaingTimeCounter.next(this.eventDetails.eventTime);
        this.resultService.resultsUtils.countDown = this.remainingTime;
      }
    } catch (err) {
      console.log('GET TIME ERROR ---> ', err);
      this.cacheEvents = [];
      this.cacheTournaments = [];
      this.loadEvents();
    }
  }

  loadEvents(): void {
    try {
      let eventRemoved : EventInfo;
      if (this.initCurrentEvent) {
        this.loadEventsFromApi().then(() => this.resultService.getLastResult());
      } else { 
        let eventRemoved: EventInfo = this.eventDetails.events[0];
        this.loadEventsFromApi(eventRemoved).then(() => {
          if ((this.cacheTournaments && this.cacheTournaments.length > 0) ||
            (this.cacheEvents && this.cacheEvents.length > 0)) {
            this.slideToNextEvent();
            this.currentAndSelectedEventTime();
            this.resultService.getLastResult();
          }
        });
      }
      // Resume event's countdown
      if (this.countdownSub && this.countdownSub.closed || !this.countdownSub) {
        this.countdownSub = timer(1000, 1000).subscribe(() => this.getTime());
      }
    } catch (err) {
      console.log('main --> loadEvents : ', err);
    }
  }

  /**
   *  slide the current event selected to next one available on the event list
   */
  private slideToNextEvent(): void {
    let nextEventItems: number = this.productService.product.layoutProducts.nextEventItems;
    // check the exception layout
    nextEventItems = nextEventItems - 1;
    const event: EventInfo = new EventInfo();
    if (this.productService.product.layoutProducts.type !== LAYOUT_TYPE.SOCCER) {
      event.number = this.cacheEvents[nextEventItems].id;
      event.label = this.cacheEvents[nextEventItems].nm;
      event.date = new Date(this.cacheEvents[nextEventItems].sdtoffset);
    } else {
      event.number = this.cacheTournaments[nextEventItems].id;
      event.label = this.cacheTournaments[nextEventItems].nm;
      event.date = new Date(this.cacheTournaments[nextEventItems].sdtoffset);
    }
    this.eventDetails.events[nextEventItems] = event;
  }

  /**
   * @param all = When it is true refresh the cache event.
   * Inside it, it must be created the request object.
   * The reference values is taken by "ProductService" on object "product".
   */
  async loadEventsFromApi(eventRemoved?: EventInfo): Promise<void> {
    return new Promise((resolve, reject) => {
      const request: VirtualProgramTreeBySportRequest = {
        SportIds: this.productService.product.sportId.toString(),
        CategoryTypes: this.productService.product.codeProduct,
        Source: PlaySource.VDeskWeb,
        Item: this.userservice.getUserId()
      };
      this.elysApi.virtual.getVirtualTreeV2(request).then((sports: VirtualProgramTreeBySportResponse) => {
        const tournaments: VirtualBetTournamentExtended[] = sports.Sports[0].ts;
        this.productService.product.layoutProducts.multiFeedType = tournaments[0].mft;

        // the checkDuplicaIndex prevent the multiload event if the API response is not correct
        let checkDuplicateIndex = 0;
        if (eventRemoved !== undefined) {
          if (tournaments[0].evs.findIndex(tournament => tournament.id === eventRemoved.number) !== -1 ||
            tournaments.findIndex(tournament => tournament.id === eventRemoved.number) !== -1
          ) {
            checkDuplicateIndex = 1;
          }
        }
        this.resultService.resultsUtils.isDuplicatedEvent = checkDuplicateIndex > 0;
        if (this.productService.product.layoutProducts.type !== LAYOUT_TYPE.SOCCER) {
          // Load all events
          this.resultService.resultsUtils.nextEventNumber = sports.Sports[0].ts[0].evs[0].id
          this.cacheEvents = tournaments[0].evs;
          this.resultService.resultsUtils.nextEventDuration = sports.Sports[0].ts[0].evs[0].duration;
          for (let index = checkDuplicateIndex; index < this.productService.product.layoutProducts.nextEventItems; index++) {
            const event: EventInfo = new EventInfo();
            event.number = this.cacheEvents[index].id;
            event.label = this.cacheEvents[index].nm;
            event.date = new Date(this.cacheEvents[index].sdtoffset);
            this.eventDetails.events[index - checkDuplicateIndex] = event;
          }
          // load markets from PRODUCT SOCCER
        } else {
          this.resultService.resultsUtils.nextEventNumber = sports.Sports[0].ts[0].id;
          this.cacheTournaments = tournaments;
          this.resultService.resultsUtils.nextEventDuration = sports.Sports[0].ts[0].duration;
          for (let index = checkDuplicateIndex; index < this.productService.product.layoutProducts.nextEventItems; index++) {
            const event: EventInfo = new EventInfo();
            event.number = this.cacheTournaments[index].id;
            event.label = this.cacheTournaments[index].nm;
            event.date = new Date(this.cacheTournaments[index].sdtoffset);
            this.eventDetails.events[index - checkDuplicateIndex] = event;
          }
        }
        if (this.initCurrentEvent || this.eventDetails.currentEvent === 0) {
          this.currentAndSelectedEventTime(false);
        }
        resolve();

      }, (error) => {
        // check the error
        if (error.status === 401) {
          this.userservice.logout();
          this.countdownSub.unsubscribe();
          return;
        }
        reject(error);
      });
    });
  }

  /**
   * Method to retrieve the details of the events contained in the tournament.
   * @param tournamentNumber tournament for which collect the events' details.
   */
  private eventDetailOddsByCacheTournament(tournamentNumber: number): void {
    // Get the tournament information from the cache.
    const tournament: VirtualBetTournamentExtended = this.cacheTournaments.filter(
      (cacheTournament: VirtualBetTournament) => cacheTournament.id === tournamentNumber
    )[0];
    // If the tournament doesn't contain yet the events information, load them calling the API.
    if (tournament && (!tournament.matches || tournament.matches == null || tournament.matches.length === 0)) {
      this.feedData.getEventVirtualDetail(this.userservice.getUserId(), tournamentNumber)
        .then((sportDetail: VirtualDetailOddsOfEventResponse) => {
          try {
            const matches: Match[] = [];
            const overViewArea: Area[] = [];
            const listDetailArea: ListArea[] = [];

            // cicle the tournament's matches and save their data
            for (const match of sportDetail.Sport.ts[0].evs) {
              // created a temporary match object
              const tmpMatch: Match = {
                id: match.id,
                name: match.nm,
                smartcode: match.smc,
                hasOddsSelected: false,
                isVideoShown: match.ehv,
                isDetailOpened: false,
                selectedOdds: [],
                virtualBetCompetitor: match.tm
              };
              // Clone temporary areas from default values
              const tmpAreaOverview = clone(overviewAreas);
              const tmpDetailArea = clone(areas);
              const matchExtended: VirtualBetEventExtended = clone(match);
              const tmpMarkets: VirtualBetMarketExtended[] = matchExtended.mk.map(market => {
                // Check the validity of the odds. Odd is valid if greater than 1.05.
                for (const selection of market.sls) {
                  if (selection.ods[0].vl <= 1.05) {
                    selection.isValid = false;
                  } else {
                    selection.isValid = true;
                  }
                }
                // Sort the selection of each market using their "tp" attribute.
                market.sls = market.sls.sort((a, b) => a.tp - b.tp);
                return market;
              });
              // Cicle the current match's markets and save on the temporary "tmpAreaOverview"
              for (const market of tmpMarkets) {
                // Find the occurrence and append the selections' data
                tmpAreaOverview.markets.map(marketOverviewFilter => {
                  if (marketOverviewFilter.id === market.tp && market.spv === marketOverviewFilter.specialValueOrSpread) {
                    marketOverviewFilter.selections = market.sls;
                  }
                });
              }

              // Initialize the lowestOdd and highestOdd.
              let lowestOdd: SpecialOddData;
              let highestOdd: SpecialOddData;
              // Cicle the temporary detail's area
              tmpDetailArea.forEach((detail, areaIndex) => {
                // Cicle the current match's markets and save on the temporary "tmpDetailArea"
                detail.markets.forEach((areaMarket, marketIndex) => {
                  // Find the occurrence and append the selections' data
                  const tmpMk: VirtualBetMarketExtended = tmpMarkets.filter(
                    market => market.tp === areaMarket.id && market.spv === areaMarket.specialValueOrSpread
                  )[0];
                  areaMarket.selections = tmpMk.sls;
                  // Looking for the highest and lowest odd.
                  tmpMk.sls.forEach((odd, oddIndex) => {
                    // Initialization of "lowestOdd".
                    if (!lowestOdd && odd.isValid) {
                      lowestOdd = {
                        areaIndex: areaIndex,
                        marketIndex: marketIndex,
                        oddIndex: oddIndex,
                        val: odd.ods[0].vl
                      };
                    }
                    // Initialization of "highestOdd".
                    if (!highestOdd) {
                      highestOdd = {
                        areaIndex: areaIndex,
                        marketIndex: marketIndex,
                        oddIndex: oddIndex,
                        val: odd.ods[0].vl
                      };
                    }
                    // Looking for the highest and lowest odd.
                    if (lowestOdd && odd.ods[0].vl < lowestOdd.val && odd.isValid) {
                      if (areaIndex !== lowestOdd.areaIndex) {
                        lowestOdd.areaIndex = areaIndex;
                      }
                      if (marketIndex !== lowestOdd.marketIndex) {
                        lowestOdd.marketIndex = marketIndex;
                      }
                      lowestOdd.oddIndex = oddIndex;
                      lowestOdd.val = odd.ods[0].vl;
                    }
                    if (highestOdd && odd.ods[0].vl > highestOdd.val) {
                      if (areaIndex !== highestOdd.areaIndex) {
                        highestOdd.areaIndex = areaIndex;
                      }
                      if (marketIndex !== highestOdd.marketIndex) {
                        highestOdd.marketIndex = marketIndex;
                      }
                      highestOdd.oddIndex = oddIndex;
                      highestOdd.val = odd.ods[0].vl;
                    }
                  });
                });
              });
              // Set lowest and highest odd.
              tmpDetailArea[lowestOdd.areaIndex].hasLowestOdd = true;
              tmpDetailArea[lowestOdd.areaIndex].markets[lowestOdd.marketIndex].selections[lowestOdd.oddIndex].isLowestOdd = true;
              tmpDetailArea[highestOdd.areaIndex].hasHighestOdd = true;
              tmpDetailArea[highestOdd.areaIndex].markets[highestOdd.marketIndex].selections[highestOdd.oddIndex].isHighestOdd = true;
              // Save the datas to tournament object
              matches.push(tmpMatch);
              overViewArea.push(tmpAreaOverview);
              listDetailArea.push(tmpDetailArea);
            }

            tournament.matches = matches;
            tournament.overviewArea = overViewArea;
            tournament.listDetailAreas = listDetailArea;

            this.currentProductDetails = tournament;

            this.attempts = 0;
          } catch (err) {
            console.log(err);
            if (!this.attempts || this.attempts < 3) {
              this.attempts += 1;
              timer(1000).subscribe(() => this.eventDetailOddsByCacheTournament(tournamentNumber));
            } else {
              this.attempts = 0;
            }
          }
        }, (error) => {
          // check the error
          if (error.status === 401) {
            this.userservice.logout();
            this.countdownSub.unsubscribe();
            return;
          }

          this.attempts = this.attempts + 1;
          if (this.attempts < 2) {
            timer(1000).subscribe(() => this.eventDetailOddsByCacheTournament(tournamentNumber));
          } else {
            this.countdownSub.unsubscribe();
          }
        });
    }
  }


  /**
   * Get ranking data
   * @param tournamentId
   */
  async getRanking(tournamentId: number): Promise<VirtualGetRankByEventResponse> {
    // Get ranking data
    if (!this.currentProductDetails.ranking) {
      this.currentProductDetails.ranking = await this.elysApi.virtual.getRanking(tournamentId);
    }
    return this.currentProductDetails.ranking;
  }

  currentAndSelectedEventTime(resetAllSelections: boolean = true) {
    if (!this.eventDetails) {
      return;
    }
    // Check current event index, if is selected an event, decrease the index because the first event is completed and removed
    if (this.eventDetails.currentEvent > 0) {
      this.eventDetails.currentEvent = this.eventDetails.currentEvent - 1;
      if (this.initCurrentEvent) {
        this.resetPlayEvent();
        this.currentEventSubscribe.next(0);
      } else {
        // set to reset all variables
        this.toResetAllSelections = false;
        this.currentEventSubscribe.next(this.eventDetails.currentEvent);
      }
    } else if (this.eventDetails.currentEvent === 0) {
      // set to reset all variables
      if (resetAllSelections) {
        this.toResetAllSelections = true;
      }
      this.currentEventSubscribe.next(0);
    }

    if (this.initCurrentEvent) {
      this.initCurrentEvent = false;
    }

    // Calculate remaning time for first Event
    if (this.eventDetails.currentEvent > 0) {
      this.remainingEventTime(this.eventDetails.events[0].number).then((eventTime: EventTime) => {
        this.remainingTime = eventTime;
      });
    }
  }

  remainingEventTime(idEvent: number): Promise<EventTime> {
    const request: VirtualEventCountDownRequest = {
      SportId: this.productService.product.sportId.toString(),
      MatchId: idEvent
    };
    return this.elysApi.virtual.getCountdown(request).then((value: VirtualEventCountDownResponse) => {
      if (value.CountDown <= 0) {
        this.initCurrentEvent = true;
        this.productService.changeProduct(this.productService.product.codeProduct);
        return;
      }
      const sec: number = (value.CountDown / 10000000);
      const eventTime: EventTime = new EventTime();
      eventTime.minute = Math.floor(sec / 60);
      eventTime.second = Math.floor(sec % 60);
      return eventTime;
    });
  }

  /**
   *
   */
  resetPlayEvent(): void {
    this.placingEvent = new PlacingEvent();
    this.smartCode = new Smartcode();
    this.placingEvent.eventNumber = (this.eventDetails.events[0]) ? this.eventDetails.events[this.eventDetails.currentEvent].number : -1;
    // this.createPlayerList();

    // Create a new polyfunctionArea object
    const polyfunctionalArea: PolyfunctionalArea = new PolyfunctionalArea();
    // take the last polyfunctionArea's value from Subject
    const tempPolyfunctionalArea: PolyfunctionalArea = this.productService.polyfunctionalAreaSubject.getValue();
    // check if global 'PolyfunctionalArea' has the grouping and put it on new object before to replace it
    if (tempPolyfunctionalArea.hasOwnProperty('grouping')) {
      polyfunctionalArea.grouping = tempPolyfunctionalArea.grouping;
    }
    // updated the new PolyfunctionalArea
    this.productService.polyfunctionalAreaSubject.next(polyfunctionalArea);
    this.productService.polyfunctionalStakeCouponSubject.next(new PolyfunctionalStakeCoupon());
    if (this.productService.product.layoutProducts.type === LAYOUT_TYPE.RACING) {
      this.clearPlayerListEvents();
    }
  }

  clearPlayerListEvents() {
    if (!this.playersList) {
      this.createPlayerList();
      return;
    }

    this.playersList.forEach((player) => {
      player.actived = false;
      player.selectable = true;
    });
  }

  private eventDetailOdds(eventNumber: number, attemptRollBack?: number): void {
    if (this.productService.product.layoutProducts.type === LAYOUT_TYPE.SOCCER) {
      if (this.cacheTournaments.length === 0) {
        return;
      }
      this.eventDetailOddsByCacheTournament(eventNumber);
      return;
    }
    if (this.cacheEvents.length === 0) {
      return;
    }

    const event: VirtualBetEvent = this.cacheEvents.find((cacheEvent: VirtualBetEvent) => cacheEvent.id === eventNumber);
    // Ceck, if it is empty load from api
    if (!event || event && event.mk == null || event && event.mk.length === 0) {
      this.feedData.getEventVirtualDetail(this.userservice.getUserId(), eventNumber).
        then((sportDetail: VirtualDetailOddsOfEventResponse) => {
          try {
            event.mk = sportDetail.Sport.ts[0].evs[0].mk;
            event.tm = sportDetail.Sport.ts[0].evs[0].tm;
            this.currentEventDetails = event;
            this.attempts = 0;
          } catch (err) {
            console.log('getEventVirtualDetail ---> error: ', err);
            if (this.attempts < 5) {
              this.attempts++;
              timer(3000).subscribe(() => this.eventDetailOdds(eventNumber));
            } else {
              this.attempts = 0;
            }
          }
        }, (error) => {
          // check the error
          if (error.status === 401) {
            this.userservice.logout();
            this.countdownSub.unsubscribe();
            return;
          }

          this.attempts = this.attempts + 1;
          if (this.attempts < 2) {
            console.log('resume event attempt: ', this.attempts);
            timer(3000).subscribe(() => this.eventDetailOdds(eventNumber));
          } else {
            this.countdownSub.unsubscribe();
            this.productService.changeProduct(this.productService.product.codeProduct);
          }
        });
    }
  }

  checkIfCouponIsReadyToPlace(): boolean {
    return this.couponService.checkIfCouponIsReadyToPlace();
  }

  /**
   * Method to add an odd to the polyfunction area from playble board showing odds.
   * @param odd Selected odd.
   */
  placingOddByOdd(marketId: number, odd: VirtualBetSelection): void {
    if (this.couponService.checkIfCouponIsReadyToPlace()) {
      return;
    }
    let removed: boolean;

    if (!this.placingEvent) {
      this.placingEvent.eventNumber = this.eventDetails.events[this.eventDetails.currentEvent].number;
    }
    const oddSelected: VirtualBetSelectionExtended = odd;
    oddSelected.marketId = marketId;
    if (this.placingEvent.odds.length === 0) {
      this.placingEvent.odds.push(oddSelected);
    } else {
      for (let idx = 0; idx < this.placingEvent.odds.length; idx++) {
        const item = this.placingEvent.odds[idx];
        if (item.id === odd.id && item.marketId === marketId) {
          this.placingEvent.odds.splice(idx, 1);
          removed = true;
        }
      }
      if (!removed) {
        this.placingEvent.odds.push(oddSelected);
      }
    }
    this.smartCode = new Smartcode();
    this.populatingPolyfunctionAreaByOdds();
  }


  /**
   * Place the player selected inside the polyfunctional area and smartbet.
   * @param player
   */
  placingOdd(player: Player): void {

    if (this.couponService.checkIfCouponIsReadyToPlace()) {
      return;
    }
    if (this.placingEvent.isSpecialBets) {
      this.resetPlayEvent();
    }
    let removed: boolean;

    if (!this.placingEvent) {
      this.placingEvent.eventNumber = this.eventDetails.events[this.eventDetails.currentEvent].number;
    }
    player.actived = true;

    if (this.placingEvent.players.length === 0) {
      this.placingEvent.players.push(player);
      this.checkedIsSelected(player);
    } else {
      for (let idx = 0; idx < this.placingEvent.players.length; idx++) {
        const item = this.placingEvent.players[idx];
        if (item.number === player.number && item.position === player.position) {
          this.placingEvent.players.splice(idx, 1);
          this.checkedIsSelected(player, true);
          removed = true;
        }
      }
      if (!removed) {
        this.placingEvent.players.push(player);
        this.checkedIsSelected(player);
      }
    }
    this.placeOdd();
  }

  placeOdd() {
    if (this.couponService.checkIfCouponIsReadyToPlace()) {
      return;
    }
    // Extract the event's odds from cache
    const odds: VirtualBetEvent = this.cacheEvents.filter(
      (cacheEvent: VirtualBetEvent) => cacheEvent.id === this.placingEvent.eventNumber
    )[0];

    this.smartCode = new Smartcode();
    this.populatingPolyfunctionArea(odds);
  }

  typePlacing(type: TypePlacingEvent) {
    if (this.placingEvent.typePlace === type) {
      this.placingEvent.typePlace = undefined;
      this.placingEvent.thirdRowDisabled = false;
    } else {
      this.placingEvent.typePlace = type;
      if (this.placingEvent.typePlace !== undefined && this.placingEvent.typePlace !== 2) {
        // Deselect all players in the row #3
        this.deselectRowPlayers(3);
        this.placingEvent.thirdRowDisabled = true;
      } else {
        this.placingEvent.thirdRowDisabled = false;
      }
    }
    this.placeOdd();
  }

  private deselectRowPlayers(position: number): void {
    for (const player of this.placingEvent.players.filter(item => item.position === position)) {
      this.placingOdd(player);
    }
  }

  private checkedIsSelected(player: Player, reset: boolean = false): void {
    this.playersList.forEach((d: Player) => {
      if (d.number === player.number && d.position !== player.position && !reset) {
        d.selectable = false;
      } else if (d.number === player.number && reset) {
        d.selectable = true;
        d.actived = false;
      }
    });
  }

  // Method to populate the polyfunctional object with the odd of a layout that shows odds.
  populatingPolyfunctionAreaByOdds() {
    let areaFuncData: PolyfunctionalArea = new PolyfunctionalArea();
    areaFuncData.activeAssociationCol = false;
    areaFuncData.activeDistributionTot = false;
    try {
      // Set the variables for the message to show on the polyfunctional area.
      // Variable containing the market identifier.
      let selection: string;
      // Variable containing the identifier of the selected odds.
      let value: string;
      const odds: BetOdd[] = [];
      if (this.placingEvent.odds.length !== 0) {
        let lastMarket: Market;
        let marketHasChanged: boolean;
        for (const odd of this.placingEvent.odds) {
          // Check if there are selections on different markets and set the market identifier.
          if (lastMarket && !marketHasChanged) {
            if (odd.marketId === lastMarket) {
              marketHasChanged = false;
            } else {
              marketHasChanged = true;
              selection = SmartCodeType[SmartCodeType.MULTI];
            }
          } else if (!lastMarket) {
            lastMarket = odd.marketId;
            selection = SmartCodeType[this.getMarketIdentifier(odd.marketId)];
          }
          // Get the selection identifier to use on the polyfunctional area.
          const selectionIdentifier = SelectionIdentifier['Selection: ' + odd.nm];
          value = value === undefined ? selectionIdentifier : value + '/' + selectionIdentifier;
          odds.push(new BetOdd(selectionIdentifier, odd.ods[0].vl, this.btnService.polyfunctionStakePresetPlayer.amount, odd.id));
          //console.log(selectionIdentifier, value);
        }
      }
      areaFuncData.selection = selection;
      areaFuncData.value = value;
      areaFuncData.amount = this.btnService.polyfunctionStakePresetPlayer.amount;
      areaFuncData.typeSlipCol = this.btnService.polyfunctionStakePresetPlayer.typeSlipCol;
      areaFuncData.odds = odds;
    } catch (err) {
      console.log(err);
      areaFuncData = {};
    } finally {
      areaFuncData.firstTap = true;
      this.productService.polyfunctionalAreaSubject.next(areaFuncData);
    }
  }

  /**
   * Create a polyfunctional object for showing and insert the odds to coupon.
   * @param odd
   */
  populatingPolyfunctionArea(odd: VirtualBetEvent): void {
    let areaFuncData: PolyfunctionalArea = new PolyfunctionalArea();
    areaFuncData.activeAssociationCol = false;
    areaFuncData.activeDistributionTot = false;
    try {
      // Check if is first insert
      let playerName: string;
      if (this.placingEvent.players.length === 1 && !this.placingEvent.isSpecialBets && this.placingEvent.typePlace === undefined) {
        // Single selection
        areaFuncData.selection = Podium[this.placingEvent.players[0].position];
        areaFuncData.value = this.placingEvent.players[0].number;
        // Match player from object tm with mk        
        playerName = odd.tm.filter(t => t.ito === areaFuncData.value)[0].nm;
      } else if ((this.placingEvent.players.length > 1 && !this.placingEvent.isSpecialBets) || this.placingEvent.typePlace) {
        // Composit selection
        this.placingEvent.players.forEach(item => {
          if (item.position === 1) {
            this.smartCode.selWinner.push(item.number);
          } else if (item.position === 2) {
            this.smartCode.selPlaced.push(item.number);
          } else if (item.position === 3) {
            this.smartCode.selPodium.push(item.number);
          }
        });
        // Type place particular iterations
        if (this.placingEvent.typePlace === TypePlacingEvent.ST && this.smartCode.selWinner.length > 2) {
          this.placingEvent.secondRowDisabled = true;
          this.deselectRowPlayers(2);
        } else {
          this.placingEvent.secondRowDisabled = false;
        }
      } else if (this.placingEvent.isSpecialBets) {
        // Specialbets OVER / UNDER / EVEN / ODD
        // Setting label selection
        areaFuncData.selection = SpecialBet[this.placingEvent.specialBetValue];
        areaFuncData.value = SpecialBetValue[this.placingEvent.specialBetValue];
      }

      // Check smartcode and extract composit bets
      areaFuncData = this.checkSmartCode(areaFuncData);
      // Set amount
      areaFuncData.amount = this.btnService.polyfunctionStakePresetPlayer.amount;
      // Verify if the type of betslip is set
      areaFuncData.typeSlipCol = this.btnService.polyfunctionStakePresetPlayer.typeSlipCol;
      // Extract odds
      if (this.smartCode.code) {
        areaFuncData.selection = this.smartCode.code;
        areaFuncData = this.extractOdd(odd, areaFuncData);
      } else {
        areaFuncData = this.extractOdd(odd, areaFuncData, playerName);
      }
    } catch (err) {
      console.log(err);
      areaFuncData = {};
    } finally {
      areaFuncData.firstTap = true;
      this.productService.polyfunctionalAreaSubject.next(areaFuncData);
    }
  }

  /**
   *
   * @param odd
   * @param areaFuncData
   * @param playerName
   */
  public extractOdd(odd: VirtualBetEvent, areaFuncData: PolyfunctionalArea, playerName?: string): PolyfunctionalArea {
    let oddsToSearch: string[] = [];
    // Check if the smartcode is playable to shortcut method
    let isShortCutPlayeable: boolean;
    switch (areaFuncData.selection) {
      case SmartCodeType[SmartCodeType['1VA']]:
      case SmartCodeType[SmartCodeType.AOX]:
        // Generate sorted combination by 2 of the selections in the rows.
        oddsToSearch = this.generateOdds(areaFuncData.value.toString(), CombinationType.By2, false);
        isShortCutPlayeable = true;
        break;
      case SmartCodeType[SmartCodeType.AB]:
        // Generate sorted combination by 2 of the selections in the rows in order.
        oddsToSearch = this.generateOdds(areaFuncData.value.toString(), CombinationType.By2, true);
        break;
      case SmartCodeType[SmartCodeType.TOX]:
        // Generate sorted combination by 3 of the selections in the rows.
        oddsToSearch = this.generateOdds(areaFuncData.value.toString(), CombinationType.By3, true);
        break;
      case SmartCodeType[SmartCodeType.AR]:
        // Generate combination by 2 of the first row selections not in order with return.
        if (areaFuncData.value.toString().indexOf('/') === -1) {
          oddsToSearch = this.generateOddsRow(areaFuncData.value.toString(), CombinationType.By2, false, true);
        } else {
          // of the first and second row selections in order with return
          oddsToSearch = this.generateOdds(areaFuncData.value.toString(), CombinationType.By2, false, true);
        }
        break;
      case SmartCodeType[SmartCodeType.AX]:
        // Generate sorted combination by 2 of the first row selections.
        oddsToSearch = this.generateOddsRow(areaFuncData.value.toString(), CombinationType.By2, true);
        isShortCutPlayeable = true;
        break;
      case SmartCodeType[SmartCodeType.TNX]: // Trifecta
        // Generate combination by 3 of the first row selections not in order.
        oddsToSearch = this.generateOddsRow(areaFuncData.value.toString(), CombinationType.By3, false);
        isShortCutPlayeable = true;
        break;
      case SmartCodeType[SmartCodeType.VT]: // Winning trio
        // Generate combination by 3 of the selections in the rows not in order.
        oddsToSearch = this.generateOdds(areaFuncData.value.toString(), CombinationType.By3, false);
        areaFuncData.shortcut = SmartCodeType.VX;
        isShortCutPlayeable = true;
        break;
      case SmartCodeType[SmartCodeType.AT]: // Combined trio
        // Generate combination by 3 of the selections in the rows not in order and with the first row fixed.
        oddsToSearch = this.generateOdds(areaFuncData.value.toString(), CombinationType.By3, false, false, true);
        areaFuncData.shortcut = SmartCodeType.ASX;
        isShortCutPlayeable = true;
        break;
      case SmartCodeType[SmartCodeType.TR]: // Multiple selection Trio in order with return
        // Generate combination by 3 of the first, second and third row selections in order with return.
        oddsToSearch = this.generateOdds(areaFuncData.value.toString(), CombinationType.By3, true, true, true);
        isShortCutPlayeable = false;
        break;

      // AMERICAN ROULETTE
      case SmartCodeType[SmartCodeType.R]: // Multiple selection Trio in order with return
        // Generate combination by 3 of the first, second and third row selections in order with return.
        // oddsToSearch = this.generateOdds(areaFuncData.value.toString(), undefined, false);
        areaFuncData.shortcut = SmartCodeType.R;
        isShortCutPlayeable = true;
        break;
    }

    if (isShortCutPlayeable) {
      // When the smart code has a shortcut available,
      // it is written inside the "PolyfunctionalArea" object that will be read by the couponService
      areaFuncData.shortcut = areaFuncData.shortcut ? areaFuncData.shortcut : SmartCodeType[areaFuncData.selection];
      areaFuncData.smartBetCode = odd.smc;
    }
    areaFuncData.odds = [];
    for (const m of odd.mk.filter((market: VirtualBetMarket) => market.tp === this.typeSelection(areaFuncData.selection))) {
      // If the selection is PODIUM, WINNER or SHOW
      if (playerName) {
        for (const checkOdd of m.sls.filter(o => o.nm === playerName)) {
          const betOdd: BetOdd = new BetOdd(playerName, checkOdd.ods[0].vl, areaFuncData.amount, checkOdd.id);
          areaFuncData.odds.push(betOdd);
        }
      } else if (!this.smartCode.code) {
        // If the selection is EVEN, ODD, UNDER or OVER
        for (const checkOdd of m.sls.filter(o => o.nm.toUpperCase() === areaFuncData.selection.toUpperCase())) {
          const betOdd: BetOdd = new BetOdd(checkOdd.nm.toUpperCase(), checkOdd.ods[0].vl, areaFuncData.amount, checkOdd.id);
          areaFuncData.odds.push(betOdd);
        }
      } else {
        if (oddsToSearch.length > 0) {
          // Search for multiple odds
          for (const checkOdd of m.sls) {
            if (oddsToSearch.includes(checkOdd.nm)) {
              areaFuncData.odds.push(
                new BetOdd(
                  checkOdd.nm,
                  checkOdd.ods[0].vl,
                  areaFuncData.typeSlipCol === TypeBetSlipColTot.TOT ? areaFuncData.amount / oddsToSearch.length : areaFuncData.amount,
                  checkOdd.id
                )
              );
            }
          }
        } else {
          // Search for matchName
          const matchName: string = areaFuncData.value.toString().replace(/\//g, '-');
          for (const checkOdd of m.sls.filter(o => o.nm === matchName)) {
            const betOdd: BetOdd = new BetOdd(checkOdd.nm.toUpperCase(), checkOdd.ods[0].vl, areaFuncData.amount, checkOdd.id);
            areaFuncData.odds.push(betOdd);
          }
        }
      }
    }
    return areaFuncData;
  }

  // Method to get the selection identifier to show on the polyfunctional area.
  getSelectionIdentifier(selectionName: string): string {
    const index = selectionName.indexOf('+');
    if (index > 0 && index < 3) {
      const competitor = selectionName[0];
      selectionName = competitor + selectionName.substring(index + 2);
    }
    return selectionName;
  }

  /**
   * Method to get the market identifier to use on the polyfunctional area.
   * @param marketId Enum of the market based on the market.tp of the feed.
   */
  getMarketIdentifier(marketId: Market): SmartCodeType {
    switch (marketId) {
      case Market['1X2']:
      case Market['1X2OverUnder']:
      case Market['1X2WinningSector']:
        return SmartCodeType.V;
      case Market['WinningSector']:
        return SmartCodeType.S;
      case Market['OverUnder']:
        return SmartCodeType.OU;
      case Market['StraightUp']:
        return SmartCodeType.R;
    }
  }

  /**
   * This function return a tp correspondence value for map it on feed.
   * Example: for feed search a winner odds and the parameter selection is Winner return 40.
   * @param selection is equals a Podium or SpecialBet enum key
   */
  typeSelection(selection: string): number {
    switch (selection) {
      case 'WINNER':
        return 40; // Winner
        break;
      case 'PLACED':
        return 5; // Placed
        break;
      case 'SHOW':
        return 6; // Show
        break;
      case 'OVER':
      case 'UNDER':
        return 7; // Over/Under Pos.
      case 'EVEN':
      case 'ODD':
        return 8; // Odd/Even Pos.
      case 'AO':
      case '1VA':
      case 'AOX':
      case 'AR':
        return 9; // Exacta
      case 'T':
      case 'TOX':
      case 'TNX':
      case 'VT':
      case 'AT':
      case 'TR':
        return 12; // Trifecta
      case 'AS':
      case 'AX':
      case 'AB':
        return 11; // Quinella
      default:
        return -1;
    }
  }

  /**
   * Generate the smartcode form PolyfunctionalArea object
   * @param areaFuncData
   */
  private checkSmartCode(areaFuncData: PolyfunctionalArea): PolyfunctionalArea {
    this.smartCode.code = null;

    switch (this.placingEvent.typePlace) {
      case TypePlacingEvent.ACCG: // Place ACCG bet
        this.smartCode.code = this.placeTypeACCG(areaFuncData);
        break;
      case TypePlacingEvent.ST: // Place ST bet
        this.smartCode.code = this.placeTypeST(areaFuncData);
        break;
      case TypePlacingEvent.R: // Place R bet
        this.smartCode.code = this.placeTypeR(areaFuncData);
        break;
      default:
        // Normal bet
        // Setting the PolyfunctionalArea with only a winning selection
        if (this.smartCode.selWinner.length === 1) {
          if (this.smartCode.selPlaced.length === 1 && this.smartCode.selPodium.length === 0) {
            this.smartCode.code = SmartCodeType[SmartCodeType.AO];
          } else if (
            // The second selection is multiple of 1
            this.smartCode.selPlaced.length > 1 &&
            this.smartCode.selPodium.length === 0
          ) {
            this.smartCode.code = SmartCodeType[SmartCodeType['1VA']];
          } else if (this.smartCode.selPlaced.length === 1 && this.smartCode.selPodium.length === 1) {
            this.smartCode.code = SmartCodeType[SmartCodeType['T']];
            areaFuncData.value =
              this.smartCode.selWinner.join('') + '/' + this.smartCode.selPlaced.join('') + '/' + this.smartCode.selPodium.join('');
          } else if (this.smartCode.selPlaced.length > 0 && this.smartCode.selPodium.length > 0) {
            this.smartCode.code = SmartCodeType[SmartCodeType.TOX];
            areaFuncData.value =
              this.smartCode.selWinner.join('') + '/' + this.smartCode.selPlaced.join('') + '/' + this.smartCode.selPodium.join('');
          }
        } else if (this.smartCode.selWinner.length > 1) {
          if (this.smartCode.selPlaced.length > 0 && this.smartCode.selPodium.length === 0) {
            // Items in the first and second row
            this.smartCode.code = SmartCodeType[SmartCodeType.AOX];
          } else if (this.smartCode.selPlaced.length > 0 && this.smartCode.selPodium.length > 0) {
            // Items in all the rows
            this.smartCode.code = SmartCodeType[SmartCodeType.TOX];
            areaFuncData.value =
              this.smartCode.selWinner.join('') + '/' + this.smartCode.selPlaced.join('') + '/' + this.smartCode.selPodium.join('');
          }
        }
        if (this.smartCode.selPlaced.length > 0 && this.smartCode.selPodium.length === 0) {
          if (this.smartCode.code === 'AO') {
            areaFuncData.value = this.smartCode.selWinner.join('') + '-' + this.smartCode.selPlaced.join('');
          } else {
            areaFuncData.value = this.smartCode.selWinner.join('') + '/' + this.smartCode.selPlaced.join('');
          }
        }
    }

    return areaFuncData;
  }

  /**
   * Generate the smarcode for ACCG form PolyfunctionalArea object
   * @param areaFuncData PolyfunctionalArea object
   */
  private placeTypeACCG(areaFuncData: PolyfunctionalArea): string {
    // One or more selections on the first row
    if (this.smartCode.selWinner.length >= 1) {
      if (this.smartCode.selPlaced.length === 0 && this.smartCode.selPodium.length === 0) {
        // Only selections in the first row
        if (this.smartCode.selWinner.length === 2) {
          // Single
          // Sort the displayed values
          this.smartCode.selWinner.sort(function (a, b) {
            return a - b;
          });
          areaFuncData.value = this.smartCode.selWinner.join('-');
          return SmartCodeType[SmartCodeType.AS];
        } else if (this.smartCode.selWinner.length > 2) {
          // Multiple
          this.smartCode.selWinner.sort(function (a, b) {
            return a - b;
          });
          areaFuncData.value = this.smartCode.selWinner.join('');
          return SmartCodeType[SmartCodeType.AX];
        }
      } else if (this.smartCode.selPlaced.length > 0 && this.smartCode.selPodium.length === 0) {
        // Selections in the first and second row
        if (this.smartCode.selWinner.length === 1 && this.smartCode.selPlaced.length === 1) {
          // Only a player is selected on the first and second row the result is a single "Combination".
          // Sort the selections
          if (this.smartCode.selWinner[0] > this.smartCode.selPlaced[0]) {
            areaFuncData.value = this.smartCode.selPlaced[0] + '-' + this.smartCode.selWinner[0];
          } else {
            areaFuncData.value = this.smartCode.selWinner[0] + '-' + this.smartCode.selPlaced[0];
          }
          return SmartCodeType[SmartCodeType.AS];
        } else {
          // Combination with base and tail
          // Sort the displayed values
          this.smartCode.selWinner.sort(function (a, b) {
            return a - b;
          });
          this.smartCode.selPlaced.sort(function (a, b) {
            return a - b;
          });
          areaFuncData.value = this.smartCode.selWinner.join('') + '/' + this.smartCode.selPlaced.join('');
          return SmartCodeType[SmartCodeType.AB];
        }
      }
      return null;
    }
  }

  /**
   * Smarcode generator for ST form PolyfunctionalArea object
   * @param areaFuncData PolyfunctionalArea object.
   * @returns Generated smartcode.
   */
  private placeTypeST(areaFuncData: PolyfunctionalArea): string {
    // One or more selections on the first row
    if (this.smartCode.selWinner.length >= 1) {
      // Only selections in the first row
      if (this.smartCode.selPlaced.length === 0 && this.smartCode.selPodium.length === 0) {
        // Requirements "Trio a girare"
        if (this.smartCode.selWinner.length >= 3) {
          // Sort the displayed values
          this.smartCode.selWinner.sort(function (a, b) {
            return a - b;
          });
          areaFuncData.value = this.smartCode.selWinner.join('');
          return SmartCodeType[SmartCodeType.TNX];
        }
      } else if (this.smartCode.selPlaced.length > 0 && this.smartCode.selPodium.length === 0) {
        // Sections in the first and second row.
        if (this.smartCode.selWinner.length === 1) {
          // Requirements "Vincente Trio"
          // Enough selections on the second row to be able to create a trio
          if (this.smartCode.selPlaced.length >= 2) {
            // Sort the displayed values
            this.smartCode.selPlaced.sort(function (a, b) {
              return a - b;
            });
            areaFuncData.value = this.smartCode.selWinner[0] + '/' + this.smartCode.selPlaced.join('');
            return SmartCodeType[SmartCodeType.VT];
          }
        } else if (this.smartCode.selWinner.length === 2) {
          // Requirements "Accoppiata Trio"
          // Enough selections on the second row to be able to create a trio
          if (this.smartCode.selPlaced.length >= 1) {
            // Sort the displayed values
            this.smartCode.selWinner.sort(function (a, b) {
              return a - b;
            });
            if (this.smartCode.selPlaced.length > 1) {
              // Sort the displayed values
              this.smartCode.selPlaced.sort(function (a, b) {
                return a - b;
              });
            }
            areaFuncData.value = this.smartCode.selWinner.join('') + '/' + this.smartCode.selPlaced.join('');
            return SmartCodeType[SmartCodeType.AT];
          }
        }
      }
    }
    return null;
  }

  /**
   * Smarcode generator for R form PolyfunctionalArea object
   * @param areaFuncData PolyfunctionalArea object.
   * @returns Generated smartcode.
   */
  private placeTypeR(areaFuncData: PolyfunctionalArea): string {
    // One or more selections on the first row
    if (this.smartCode.selWinner.length >= 1) {
      // Only selections in the first row
      if (this.smartCode.selPlaced.length === 0 && this.smartCode.selPodium.length === 0) {
        // Requirements "Accoppiata in ordine con ritorno"
        if (this.smartCode.selWinner.length === 2) {
          // Sort the displayed values
          this.smartCode.selWinner.sort(function (a, b) {
            return a - b;
          });
          areaFuncData.value = this.smartCode.selWinner.join('');
          return SmartCodeType[SmartCodeType.AR];
        }
        // Only selections in the first and second row
      } else if (this.smartCode.selPlaced.length > 0 && this.smartCode.selPodium.length === 0) {
        // Selections in the first row
        if (this.smartCode.selWinner.length > 1) {
          // Sort the displayed values
          this.smartCode.selWinner.sort(function (a, b) {
            return a - b;
          });
        }
        // Selections in the second row
        if (this.smartCode.selPlaced.length > 1) {
          // Sort the displayed values
          this.smartCode.selPlaced.sort(function (a, b) {
            return a - b;
          });
        }
        areaFuncData.value = this.smartCode.selWinner.join('') + '/' + this.smartCode.selPlaced.join('');
        return SmartCodeType[SmartCodeType.AR];
        // Only selections in the first, second and third row
      } else if (this.smartCode.selPlaced.length > 0 && this.smartCode.selPodium.length > 0) {
        // Selections in the first row
        if (this.smartCode.selWinner.length > 1) {
          // Sort the displayed values
          this.smartCode.selWinner.sort(function (a, b) {
            return a - b;
          });
        }
        // Selections in the second row
        if (this.smartCode.selPlaced.length > 1) {
          // Sort the displayed values
          this.smartCode.selPlaced.sort(function (a, b) {
            return a - b;
          });
        }
        // Selections in the third row
        if (this.smartCode.selPodium.length > 1) {
          // Sort the displayed values
          this.smartCode.selPodium.sort(function (a, b) {
            return a - b;
          });
        }
        areaFuncData.value =
          this.smartCode.selWinner.join('') + '/' + this.smartCode.selPlaced.join('') + '/' + this.smartCode.selPodium.join('');
        return SmartCodeType[SmartCodeType.TR];
      }
    }
    return null;
  }

  // tslint:disable:max-line-length
  /**
   * Generate all combinations of bets from all the rows selections
   * @param value String representations. Ex. 12/34/56, 12/345
   * @param combinationType Enum (CombinationType) of the type of combination desired. Values: By2, By3.
   * @param ordered Boolean to determine if the combinations have to be in order or not. Ex: false (combinations 1-3-5, 3-1-5, 5-1-3, 5-3-1 are all valid), true (only combination 1-3-5 is valid).
   * @param withReturn Boolean to determine if the combinations have to contain the return. Default value: false. Ex: 1/345 = false (combinations: 1-3, 1-4, 1-5), true (combinations: 1-3, 1-4, 1-5, 3-1, 4-1, 5-1).
   * @param isFirstRowFixed When "true" the selections from the first row have to be always present on the combinations. Valid only in combination by 3. Value: true (the first row is fixed), false or not indicated (The second row is the fixed one).
   *  Ex:
   *    - value = 12/34, combinationType = By3, ordered = false, isFirstRowFixed = true -> result = 1-2-3, 1-2-4, 2-1-3, 2-1-4
   *    - value = 12/34, combinationType = By3, ordered = false, isFirstRowFixed = false or not indicated -> result = 1-3-4, 1-4-3, 2-3-4, 2-4-3
   * @returns Array of combinations. Ex: For type "By2" in order: 1-3-5, 1-3-6, 1-4-6, 2-3-5, 2-3-6, 2-4-5, 2-4-6. For type "By3" not in order: 1-3-4, 3-1-4, 3-4-1, 4-1-3, 4-3-1, 1-4-5 ecc.
   */
  // tslint:enable:max-line-length
  generateOdds(
    value: string,
    combinationType: CombinationType,
    ordered: boolean,
    withReturn: boolean = false,
    isFirstRowFixed?: boolean
  ): string[] {
    const selections: string[] = value.split('/');
    const returnValues: string[] = [];

    if (selections.length > 0) {
      // Extraction of the selections in the first row.
      const values1: string[] = this.extractOddFromString(selections[0]);
      for (let i1 = 0; i1 < selections[0].length; i1++) {
        if (selections.length > 1) {
          // Extraction of the selections in the second row.
          const values2: string[] = this.extractOddFromString(selections[1]);
          switch (combinationType) {
            case CombinationType.By2: // Combination of the selections By 2
              for (let i2 = 0; i2 < selections[1].length; i2++) {
                if (ordered) {
                  // Sort the combination
                  if (parseInt(values1[i1], 10) > parseInt(values2[i2], 10)) {
                    returnValues.push(values2[i2] + '-' + values1[i1]);
                  } else {
                    returnValues.push(values1[i1] + '-' + values2[i2]);
                  }
                } else {
                  returnValues.push(values1[i1] + '-' + values2[i2]);
                  if (withReturn) {
                    returnValues.push(values2[i2] + '-' + values1[i1]);
                  }
                }
              }
              break;
            case CombinationType.By3: // Combination of the selections By 3
              // The first row is the fixed one and there are enough selections to create a trio
              if (isFirstRowFixed && selections.length === 2) {
                for (let i1b = i1 + 1; i1b < selections[0].length; i1b++) {
                  for (let i2 = 0; i2 < selections[1].length; i2++) {
                    returnValues.push(values1[i1] + '-' + values1[i1b] + '-' + values2[i2]);
                    if (!ordered) {
                      returnValues.push(values1[i1b] + '-' + values1[i1] + '-' + values2[i2]);
                    }
                  }
                }
              } else {
                for (let i2 = 0; i2 < selections[1].length; i2++) {
                  // Selections on the first and second row.
                  if (selections.length === 2) {
                    // There are enough selections on the second row to make a trio.
                    if (selections[1].length >= 2) {
                      for (let i2b = i2 + 1; i2b < selections[1].length; i2b++) {
                        if (ordered) {
                          // Sort the combination
                          if (parseInt(values2[i2], 10) >= parseInt(values2[i2b], 10)) {
                            returnValues.push(values1[i1] + '-' + values2[i2b] + '-' + values2[i2]);
                          } else {
                            returnValues.push(values1[i1] + '-' + values2[i2] + '-' + values2[i2b]);
                          }
                        } else {
                          returnValues.push(values1[i1] + '-' + values2[i2] + '-' + values2[i2b]);
                          returnValues.push(values1[i1] + '-' + values2[i2b] + '-' + values2[i2]);
                        }
                      }
                    }
                  } else if (selections.length > 2) {
                    // Selections on all three rows.
                    // Extraction of the selections in the third row.
                    const values3: string[] = this.extractOddFromString(selections[2]);
                    for (let i3 = 0; i3 < selections[2].length; i3++) {
                      if (ordered) {
                        returnValues.push(values1[i1] + '-' + values2[i2] + '-' + values3[i3]);
                        if (withReturn) {
                          returnValues.push(values3[i3] + '-' + values2[i2] + '-' + values1[i1]);
                        }
                      } else {
                        returnValues.push(values1[i1] + '-' + values2[i2] + '-' + values3[i3]);
                        returnValues.push(values1[i1] + '-' + values3[i3] + '-' + values2[i2]);
                        returnValues.push(values2[i2] + '-' + values1[i1] + '-' + values3[i3]);
                        returnValues.push(values2[i2] + '-' + values3[i3] + '-' + values1[i1]);
                        returnValues.push(values3[i3] + '-' + values1[i1] + '-' + values2[i2]);
                        returnValues.push(values3[i3] + '-' + values2[i2] + '-' + values1[i1]);
                      }
                    }
                  }
                }
              }
              break;
          }
        } else {
          returnValues.push(values1[i1]);
        }
      }
    }

    return returnValues;
  }

  // tslint:disable:max-line-length
  /**
   * Generate all combinations of bets from a single row selections
   * @param value String representations, ex. 1234
   * @param combinationType Enum (CombinationType) of the type of combination desired. Values: By2 (combination by 2), By3 (combination by 3).
   * @param ordered Boolean to determine if the combinations have to be in order or not. Ex: false (combination 1-2 and 2-1 are both valid), true (only combination 1-2 is valid).
   * @param withReturn Boolean to determine if the combinations have to contain the return. Default value: false. Ex: 13 = false (combinations: 1-3), true (combinations: 1-3, 3-1).
   * @returns Array of combinations. Ex: For type "By2": 1-2, 1-3, 1-4, 2-3, 2-4, 3-4. For type "By3": 1-2-3, 1-3-4, 1-2-4, 2-1-3, 2-3-4, ecc.
   */
  // tslint:enable:max-line-length
  generateOddsRow(value: string, combinationType: CombinationType, ordered: boolean, withReturn: boolean = false): string[] {
    const returnValues: string[] = [];

    if (value.length > 0) {
      // Extraction of the selections in the row.
      const values: string[] = this.extractOddFromString(value);
      for (let i = 0; i < value.length; i++) {
        for (let j = i + 1; j < value.length; j++) {
          switch (combinationType) {
            case CombinationType.By2: // Combination of the selections By 2
              if (ordered) {
                returnValues.push(values[i] + '-' + values[j]);
              } else {
                returnValues.push(values[i] + '-' + values[j]);
                if (withReturn) {
                  returnValues.push(values[j] + '-' + values[i]);
                }
              }
              break;
            case CombinationType.By3: // Combination of the selections By 3
              for (let k = j + 1; k < value.length; k++) {
                if (ordered) {
                  returnValues.push(values[i] + '-' + values[j] + '-' + values[k]);
                } else {
                  returnValues.push(values[i] + '-' + values[j] + '-' + values[k]);
                  returnValues.push(values[i] + '-' + values[k] + '-' + values[j]);
                  returnValues.push(values[j] + '-' + values[i] + '-' + values[k]);
                  returnValues.push(values[j] + '-' + values[k] + '-' + values[i]);
                  returnValues.push(values[k] + '-' + values[i] + '-' + values[j]);
                  returnValues.push(values[k] + '-' + values[j] + '-' + values[i]);
                }
              }
              break;
          }
        }
      }
    }
    return returnValues;
  }

  /**
   * Method to extract the selection form the smarcode
   * @param value Smartcode section from where extract the selections.
   */
  extractOddFromString(value: string): string[] {
    const returnValues: string[] = [];
    for (let index = 0; index < value.length; index++) {
      returnValues.push(value.charAt(index));
    }
    return returnValues;
  }

  /**
   * Method to extract the current event selected
   * @returns VirtualBetEvent
   */
  public getCurrentEvent(): Promise<VirtualBetEvent> {
    const response = new Promise<VirtualBetEvent>((resolve, reject) => {
      resolve(this.cacheEvents.filter((cacheEvent: VirtualBetEvent) => cacheEvent.id === this.placingEvent.eventNumber)[0]);
    });
    return response;
  }

  public getCurrentTournament(): Promise<VirtualBetTournamentExtended> {
    const tournamentSelected: VirtualBetTournamentExtended = this.cacheTournaments.filter(
      (cacheTournament: VirtualBetTournamentExtended) => cacheTournament.id === this.placingEvent.eventNumber
    )[0];

    const response = new Promise<VirtualBetTournamentExtended>((resolve, reject) => {
      resolve(tournamentSelected);
    });
    return response;
  }


  /***
   * KENO
   */
  placingNumber(selected: KenoNumber): void {
    if (this.couponService.checkIfCouponIsReadyToPlace()) {
      return;
    }
    if (!this.placingEvent) {
      this.placingEvent.eventNumber = this.eventDetails.events[this.eventDetails.currentEvent].number;
    }
    if (!this.placingEvent.kenoNumbers || this.placingEvent.kenoNumbers && this.placingEvent.kenoNumbers.length === 0) {
      this.placingEvent.kenoNumbers = [];
      this.placingEvent.kenoNumbers.push(selected);
    } else {
      const idx = this.placingEvent.kenoNumbers.findIndex(item => item.number === selected.number);
      if (idx !== -1) {
        this.placingEvent.kenoNumbers.splice(idx, 1);
      } else {
        this.placingEvent.kenoNumbers.push(selected);
      }
    }
    this.populatingPolyfunctionAreaByLottery();
  }

  // Method to populate the polyfunctional object with the odd of a layout that shows odds.
  populatingPolyfunctionAreaByLottery() {
    let areaFuncData: PolyfunctionalArea = new PolyfunctionalArea();
    areaFuncData.typeSlipCol = TypeBetSlipColTot.GROUP;
    areaFuncData.activeAssociationCol = false;
    areaFuncData.activeDistributionTot = false;
    try {
      // Set the variables for the message to show on the polyfunctional area.
      // Variable containing the market identifier.
      let selection: string;
      const kenoSelected: BetOdd[] = [];
      let eventId: number;
      // Selection the current marketId
      this.getCurrentEvent().then(item => eventId = item.mk[0].sls[0].id);
      if (this.placingEvent.kenoNumbers.length !== 0) {
        let lastMarket: Market;
        let marketHasChanged: boolean;
        for (const n of this.placingEvent.kenoNumbers) {
          // Check if there are selections on different markets and set the market identifier.
          if (lastMarket && !marketHasChanged) {
            if (n.number === lastMarket) {
              marketHasChanged = false;
            } else {
              marketHasChanged = true;
              selection = SmartCodeType[SmartCodeType.MULTI];
            }
          } else if (!lastMarket) {
            lastMarket = n.number;
            selection = SmartCodeType[this.getMarketIdentifier(n.number)];
          }
          kenoSelected.push(
            new BetOdd(
              undefined,
              1,
              this.btnService.polyfunctionStakePresetPlayer.amount,
              eventId
            )
          );
        }
      }
      areaFuncData.selection = selection;
      areaFuncData.value = 0;
      areaFuncData.amount = this.btnService.polyfunctionStakePresetPlayer.amount;
      areaFuncData.typeSlipCol = TypeBetSlipColTot.GROUP;
      areaFuncData.odds = kenoSelected;
    } catch (err) {
      console.log(err);
      areaFuncData = {};
    } finally {
      areaFuncData.firstTap = true;
      this.productService.polyfunctionalAreaSubject.next(areaFuncData);
    }
  }

  /***
 * COLOURS
 */
  placingColoursNumber(selectedNumber: number): void {
    if (this.couponService.checkIfCouponIsReadyToPlace()) {
      return;
    }
    if (!this.placingEvent) {
      this.placingEvent.eventNumber = this.eventDetails.events[this.eventDetails.currentEvent].number;
    }
    if (!this.placingEvent.coloursNumbers || this.placingEvent.coloursNumbers && this.placingEvent.coloursNumbers.length === 0) {
      this.placingEvent.coloursNumbers = [];
      this.placingEvent.coloursNumbers.push(selectedNumber);
    } else {
      const idx = this.placingEvent.coloursNumbers.findIndex(item => item === selectedNumber);
      if (idx !== -1) {
        this.placingEvent.coloursNumbers.splice(idx, 1);
      } else {
        this.placingEvent.coloursNumbers.push(selectedNumber);
      }
    }
    this.populatingPolyfunctionAreaByColours();
  }

  placingColoursSelection(coloursSelection: string): void {
    if (this.couponService.checkIfCouponIsReadyToPlace()) {
      return;
    }
    if (!this.placingEvent) {
      this.placingEvent.eventNumber = this.eventDetails.events[this.eventDetails.currentEvent].number;
    }
    if (!this.placingEvent.coloursSelection) {
      this.placingEvent.coloursSelection = coloursSelection;
    } else {
      if (coloursSelection === this.placingEvent.coloursSelection) {
        this.placingEvent.coloursSelection = undefined;
      } else {
        this.placingEvent.coloursSelection = coloursSelection;
      }
    }
    this.populatingPolyfunctionAreaByColours();
  }

  // Method to populate the polyfunctional object with the odd of a layout that shows odds.
  populatingPolyfunctionAreaByColours() {
    let areaFuncData: PolyfunctionalArea = new PolyfunctionalArea();
    areaFuncData.typeSlipCol = TypeBetSlipColTot.GROUP;
    areaFuncData.activeAssociationCol = false;
    areaFuncData.activeDistributionTot = false;
    try {
      // Set the variables for the message to show on the polyfunctional area.
      const colourSelected: BetOdd[] = [];
      let eventId: number;
      // Selection the current marketId
      this.getCurrentEvent().then(item => eventId = item.mk[0].sls[0].id);
      if (this.placingEvent.coloursNumbers && this.placingEvent.coloursNumbers.length !== 0) {
        let lastMarket: Market;
        let marketHasChanged: boolean;
        for (const coloursNumber of this.placingEvent.coloursNumbers) {
          // Check if there are selections on different markets and set the market identifier.
          if (lastMarket && !marketHasChanged) {
            if (coloursNumber === lastMarket) {
              marketHasChanged = false;
            } else {
              marketHasChanged = true;
            }
          } else if (!lastMarket) {
            lastMarket = coloursNumber;
          }
          colourSelected.push(
            new BetOdd(
              undefined,
              1,
              this.btnService.polyfunctionStakePresetPlayer.amount,
              eventId
            )
          );
        }
      } else if (this.placingEvent.coloursSelection) {
        // selection case es. hi-lo
        colourSelected.push(
          new BetOdd(
            this.placingEvent.coloursSelection,
            1,
            this.btnService.polyfunctionStakePresetPlayer.amount,
            eventId
          )
        );

      }
      areaFuncData.selection = ColourGameId[this.selectedColourGameId];
      areaFuncData.value = 0;
      areaFuncData.amount = this.btnService.polyfunctionStakePresetPlayer.amount;
      areaFuncData.typeSlipCol = TypeBetSlipColTot.GROUP;
      areaFuncData.odds = colourSelected;
    } catch (err) {
      console.log(err);
      areaFuncData = {};
    } finally {
      areaFuncData.firstTap = true;
      this.productService.polyfunctionalAreaSubject.next(areaFuncData);
    }
  }



  // AMERICAN ROULETTE
  placingNumberRoulette(marketId: number, odd: VirtualBetSelection, smartBet?: SmartCodeType, smartCode?: number): void {
    if (this.couponService.checkIfCouponIsReadyToPlace()) {
      return;
    }
    let removed: boolean;
    if (!this.placingEvent) {
      this.placingEvent.eventNumber = this.eventDetails.events[this.eventDetails.currentEvent].number;
    }
    const oddSelected: VirtualBetSelectionExtended = odd;
    oddSelected.marketId = marketId;
    if (this.placingEvent.odds.length === 0) {
      this.placingEvent.odds.push(oddSelected);
    } else {
      for (let idx = 0; idx < this.placingEvent.odds.length; idx++) {
        const item = this.placingEvent.odds[idx];
        if (item.id === odd.id && item.marketId === marketId) {
          this.placingEvent.odds.splice(idx, 1);
          removed = true;
        }
      }
      if (!removed) {
        this.placingEvent.odds.push(oddSelected);
      }
    }
    this.smartCode = new Smartcode();
    this.populatingPolyfunctionAreaByARoulette(smartBet, smartCode);
  }

  populatingPolyfunctionAreaByARoulette(smartBet?: SmartCodeType, smartCode?: number) {
    let areaFuncData: PolyfunctionalArea = new PolyfunctionalArea();
    areaFuncData.activeAssociationCol = false;
    areaFuncData.activeDistributionTot = false;
    try {
      // Set the variables for the message to show on the polyfunctional area.
      // Variable containing the market identifier.
      let selection: string;
      // Variable containing the identifier of the selected odds.
      let value: string;
      const odds: BetOdd[] = [];
      if (this.placingEvent.odds.length !== 0) {

        for (const odd of this.placingEvent.odds) {
          // Get the selection identifier to use on the polyfunctional area.
          const selectionIdentifier = odd.nm;
          value = value === undefined ? selectionIdentifier : selectionIdentifier + ',' + value;
          odds.push(new BetOdd(selectionIdentifier, odd.ods[0].vl, this.btnService.polyfunctionStakePresetPlayer.amount, odd.id));
        }
        // selection used from modal betOdds
        selection = odds.length > 1 ? SmartCodeType[SmartCodeType.MULTI] : SmartCodeType[smartBet];
      }
      // Check smartcode and extract composit bets
      areaFuncData.selection = selection;
      if (smartBet && smartCode) {
        areaFuncData.shortcut = smartBet;
        areaFuncData.smartBetCode = smartCode;
      }
      areaFuncData.value = value;
      areaFuncData.amount = this.btnService.polyfunctionStakePresetPlayer.amount;
      areaFuncData.typeSlipCol = this.btnService.polyfunctionStakePresetPlayer.typeSlipCol;
      areaFuncData.odds = odds;
    } catch (err) {
      console.log(err);
      areaFuncData = {};
    } finally {
      areaFuncData.firstTap = true;
      this.productService.polyfunctionalAreaSubject.next(areaFuncData);
    }
  }
  /**
   * Method to fire the current event number change.
   * If there is a coupon, it will be asked to delete it.
   * Otherwise, if there isn't, execute the change.
   * @param selected number of event
   * @param userSelect if the event number is change by user  or it is forward by system
   *
   * */
  fireCurrentEventChange(selected: number, userSelect = false) {
    // check if the coupon is initialized
    this.couponService.checkHasCoupon();
    // set to reset all variables
    this.toResetAllSelections = true;
    // if the coupon isn't empty
    if (
      this.couponService.productHasCoupon.checked &&
      (this.eventDetails.currentEvent !== selected || userSelect) &&
      (this.couponService.coupon && this.couponService.coupon.Odds.length > 0)
    ) {
      // open modal destroy confirm coupon
      this.destroyCouponService.openDestroyCouponDialog();
      // subscribe to event dialog
      this.destroyCouponService.dialogRef.afterClosed().subscribe(elem => {
        if (elem) {
          this.currentEventSubscribe.next(selected);
        }
      });
    } else {
      // to continue
      this.currentEventSubscribe.next(selected);
    }
  }

  fireChangeColoursGame(colourGameId: ColourGameId): void {
    // if the coupon isn't empty
    if (
      this.couponService.coupon && this.couponService.coupon.Odds.length > 0
    ) {
      // open modal destroy confirm coupon
      this.destroyCouponService.openDestroyCouponDialog();
      // subscribe to event dialog
      this.destroyCouponService.dialogRef.afterClosed().subscribe(elem => {
        if (elem) {
          this.selectedColourGameId = colourGameId;
        }
      });
    } else {
      // to continue
      this.selectedColourGameId = colourGameId;
    }
    this.resetPlayEvent();
  }

}
