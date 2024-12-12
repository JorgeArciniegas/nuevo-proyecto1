import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { CouponService } from "src/app/component/coupon/coupon.service";
import { BetCouponExtended, BetCouponOddExtended, ElysCouponService } from "@elys/elys-coupon";
import { BtncalcService } from "src/app/component/btncalc/btncalc.service";
import { MainService } from "../../../main.service";
import { SoccerService } from "./soccer.service";
import { Match, VirtualBetTournamentExtended } from "../../../main.models";
import { InternalCoupon } from "src/app/component/coupon/coupon.model";
import { mockCouponSoccer, mockOddSoccer } from "src/app/mock/coupon.mock";
import { CouponConfirmDelete } from "src/app/products/products.model";
import { VirtualBetSelection } from "@elys/elys-api";
import { mockTournamentDetails } from "src/app/mock/sports.mock";
import { Observable, Subject } from "rxjs";
import { ElysCouponServiceStub } from "src/app/mock/stubs/elys-coupon-service.stub";
import { cloneData } from "src/app/mock/helpers/clone-mock.helper";

class CouponServiceStub {
  private couponHasBeenPlacedSub: Subject<boolean>;
  couponHasBeenPlacedObs: Observable<boolean>;

  coupon: InternalCoupon = mockCouponSoccer;
  productHasCoupon: CouponConfirmDelete = null;

  constructor() {
    this.couponHasBeenPlacedSub = new Subject<boolean>();
    this.couponHasBeenPlacedObs = this.couponHasBeenPlacedSub.asObservable();
  }

  checkHasCoupon = jasmine.createSpy('checkHasCoupon');

  resetCoupon(): void {
    this.couponHasBeenPlacedSub.next(true);
  }
}

class MainServiceStub {
  currentEventSubscribe: Subject<number>;
  currentEventObserve: Observable<number>;

  constructor() {
    this.currentEventSubscribe = new Subject<number>();
    this.currentEventObserve = this.currentEventSubscribe.asObservable();
  }

  placingOddByOdd = jasmine.createSpy('placingOddByOdd');

  getCurrentTournament(): Promise<VirtualBetTournamentExtended> {
    return Promise.resolve(mockTournamentDetails);
  }
}

class BtncalcServiceStub {
  tapPlus = jasmine.createSpy('tapPlus');
}

describe('SoccerService', () => {
  let service: SoccerService;
  let mainService: MainService;
  let btnCalcService: BtncalcService;
  let couponService: CouponService;
  let elysCouponService: ElysCouponServiceStub;

  beforeEach(() => {
    elysCouponService = new ElysCouponServiceStub();

    TestBed.configureTestingModule({
      providers: [
        SoccerService,
        { provide: MainService, useClass: MainServiceStub },
        { provide: BtncalcService, useClass: BtncalcServiceStub },
        { provide: ElysCouponService, useValue: elysCouponService },
        { provide: CouponService, useClass: CouponServiceStub }
      ],
    });

    service = TestBed.inject(SoccerService);
    mainService = TestBed.inject(MainService);
    btnCalcService = TestBed.inject(BtncalcService);
    couponService = TestBed.inject(CouponService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should reset the default area to Main', () => {
    const tournamentDetails: VirtualBetTournamentExtended = cloneData(mockTournamentDetails);
    service.selectedArea = 1;

    spyOn(service, 'changeArea');
    spyOn(mainService, 'getCurrentTournament').and.returnValue(Promise.resolve(tournamentDetails));

    service.getTournamentDetails();
    expect(service.changeArea).toHaveBeenCalledWith(0);
    expect(mainService.getCurrentTournament).toHaveBeenCalled();
  });

  it('should open event detail', () => {
    const tournamentDetails: VirtualBetTournamentExtended = cloneData(mockTournamentDetails);
    service.selectedMatch = 0;

    spyOn(service, 'openEventDetails');
    spyOn(mainService, 'getCurrentTournament').and.returnValue(Promise.resolve(tournamentDetails));

    service.getTournamentDetails();
    expect(service.openEventDetails).toHaveBeenCalledWith(service.selectedMatch);
    expect(mainService.getCurrentTournament).toHaveBeenCalled();
  });

  it('should get tournament details and check odd selected', fakeAsync(() => {
    const tournamentDetails: VirtualBetTournamentExtended = cloneData(mockTournamentDetails);
    const couponOdd: BetCouponOddExtended = cloneData(mockOddSoccer);
    service.selectedArea = 0;
    service.selectedMatch = -1;

    couponService.productHasCoupon = { productCodeRequest: 'DOG', checked: false };
    couponService.coupon.Odds = [couponOdd];

    const match: Match = tournamentDetails.matches.filter((item) => item.name === couponOdd.DefaultEventName)[0];
    spyOn(mainService, 'getCurrentTournament').and.returnValue(Promise.resolve(tournamentDetails));

    service.getTournamentDetails();
    tick(1000);

    couponService.productHasCoupon = null;

    expect(mainService.getCurrentTournament).toHaveBeenCalled();
    expect(service.tournament).toEqual(tournamentDetails);
    expect(match.hasOddsSelected).toBeTrue();
    expect(match.selectedOdds.includes(couponOdd.SelectionId)).toBeTrue();
  }));

  it('should subscribe to observable', fakeAsync(() => {
    service.tournament = cloneData(mockTournamentDetails);

    spyOn(service, 'getTournamentDetails');
    spyOn(service, 'verifySelectedOdds');

    service.subscribeToObservables();
    tick(1000);

    mainService.currentEventSubscribe.next(0);
    expect(service.getTournamentDetails).toHaveBeenCalled();

    const match: Match = service.tournament.matches[0];
    match.hasOddsSelected = true;
    couponService.resetCoupon();
    expect(service.couponHasBeenPlacedSubscription.closed).toBeFalse();
    expect(match.hasOddsSelected).toBeFalse();

    elysCouponService.couponHasChangedSubject.next(mockCouponSoccer);
    expect(service.couponHasChangedSubscription.closed).toBeFalse();
    expect(service.verifySelectedOdds).toHaveBeenCalled();
  }));

  it('should destroy subscriptions', fakeAsync(() => {
    spyOn(service, 'getTournamentDetails');
    spyOn(service, 'verifySelectedOdds');

    service.subscribeToObservables();
    tick(1000);

    mainService.currentEventSubscribe.next(0);
    couponService.resetCoupon();
    elysCouponService.manageOdd(null);

    service.destroySubscriptions();

    expect(service.couponHasBeenPlacedSubscription.closed).toBeTrue();
    expect(service.couponHasChangedSubscription.closed).toBeTrue();
  }));

  it('should verify selected odds', () => {
    const matchIndex: number = 0;
    const coupon: BetCouponExtended = cloneData(mockCouponSoccer);
    const couponOdd: BetCouponOddExtended = cloneData(mockOddSoccer);
    service.tournament = cloneData(mockTournamentDetails);

    couponOdd.MatchId = service.tournament.matches[matchIndex].id;
    coupon.Odds = [couponOdd];

    const match: Match = service.tournament.matches[matchIndex];
    expect(match.selectedOdds.length).toEqual(0);
    expect(match.hasOddsSelected).toEqual(false);

    service.verifySelectedOdds(coupon);

    expect(match.selectedOdds).toEqual([couponOdd.SelectionId]);
    expect(match.hasOddsSelected).toEqual(true);
  });

  it('should verify selected odds and remove uncorrect odds', () => {
    const matchIndex: number = 0;
    const coupon: BetCouponExtended = cloneData(mockCouponSoccer);
    const couponOdd: BetCouponOddExtended = cloneData(mockOddSoccer);
    service.tournament = cloneData(mockTournamentDetails);

    couponOdd.MatchId = service.tournament.matches[matchIndex].id;
    coupon.Odds = [couponOdd];

    const match: Match = service.tournament.matches[matchIndex];
    match.selectedOdds = [couponOdd.SelectionId, 1234];
    const filteredSelectedOdds: number[] = [couponOdd.SelectionId];

    service.verifySelectedOdds(coupon);

    expect(service.tournament.matches[matchIndex].selectedOdds).toEqual(filteredSelectedOdds);
  });

  it('should change area when try open event details', () => {
    const matchIndex: number = 0;
    service.tournament = cloneData(mockTournamentDetails);
    service.selectedArea = 1;

    spyOn(service, 'changeArea');

    service.openEventDetails(matchIndex);
    expect(service.changeArea).toHaveBeenCalled();
    expect(service.tournament.matches[matchIndex].isDetailOpened).toBeTrue();
  });

  it('should remove the selected match', () => {
    const matchIndex: number = 0;
    const expected: number = -1;

    service.tournament = cloneData(mockTournamentDetails);
    service.selectedArea = 0;
    service.selectedMatch = 0;

    service.openEventDetails(matchIndex);

    expect(service.selectedMatch).toEqual(expected);
    expect(service.tournament.matches[matchIndex].isDetailOpened).toBeTrue();
  });

  it('should set the new open match', () => {
    const matchIndex: number = 1;

    service.tournament = cloneData(mockTournamentDetails);
    service.selectedArea = 0;
    service.selectedMatch = -1;

    service.openEventDetails(matchIndex);

    expect(service.selectedMatch).toEqual(matchIndex);
    expect(service.tournament.matches[matchIndex].isDetailOpened).toBeTrue();
  });

  it('should set the new open match and change the status of the previous match', () => {
    const matchIndex: number = 1;

    service.tournament = cloneData(mockTournamentDetails);
    service.selectedArea = 0;
    service.selectedMatch = 0;

    service.openEventDetails(matchIndex);

    expect(service.tournament.matches[matchIndex].isDetailOpened).toBeTrue();
    expect(service.selectedMatch).toEqual(matchIndex);
  });

  it('should change area', () => {
    const areaIndex: number = 1;

    service.tournament = cloneData(mockTournamentDetails);
    service.selectedMatch = 0;
    service.selectedArea = 0;

    service.changeArea(areaIndex);

    expect(service.tournament.listDetailAreas[service.selectedMatch][areaIndex].isSelected).toBeTrue();
    expect(service.selectedArea).toEqual(areaIndex);
  });

  it('should select odd', () => {
    const marketId: number = 1;
    const selection: VirtualBetSelection = {id: 578585731, nm: '1', tp: 1, ods: [{vl: 1.35, st: 1}]};

    expect(service.oddsInProcessing.includes(selection.id)).toBeFalse();

    service.selectOdd(marketId, selection);

    expect(service.oddsInProcessing.includes(selection.id)).toBeTrue();
    expect(mainService.placingOddByOdd).toHaveBeenCalledWith(marketId, selection);
    expect(btnCalcService.tapPlus).toHaveBeenCalled();
  });
});
