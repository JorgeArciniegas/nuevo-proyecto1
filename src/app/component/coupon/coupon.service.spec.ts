import { TestBed } from "@angular/core/testing";
import { BetCouponGroup, BetCouponOdd, CancelCouponRequest, CouponCategory, CouponType, ElysApiService, FlagAsPaidRequest, StagedCouponStatus } from "@elys/elys-api";
import { AddColoursNumberRequest, AddNumberRequest, AddOddRequest, AddOddRequestSC, BetCouponOddExtended, ColoursMultiSelection, CouponServiceMessage, CouponServiceMessageType, ElysCouponService, MessageSource } from "@elys/elys-coupon";
import { AppSettings } from "src/app/app.settings";
import { mockBetOdd, mockCoupon, mockPolyfunctionalArea, mockStagedCoupon } from "src/app/mock/coupon.mock";
import { ElysCouponServiceStub } from "src/app/mock/stubs/elys-coupon-service.stub";
import { mockOperatorData, mockUserData } from "src/app/mock/user.mock";
import { SmartCodeType, TypeBetSlipColTot } from "src/app/products/main/main.models";
import { BetOdd, CouponConfirmDelete, PolyfunctionalArea } from "src/app/products/products.model";
import { DataUser } from "src/app/services/user.models";
import { UserService } from "src/app/services/user.service";
import { LAYOUT_TYPE } from "src/environments/environment.models";
import { CouponLimit, OddsStakeEdit, StakesDisplay, Error, InternalCoupon } from "./coupon.model";
import { CouponService } from "./coupon.service";
import { PrintCouponService } from "./print-coupon/print-coupon.service";
import { take } from 'rxjs/operators';
import { ElysApiServiceStub } from "src/app/mock/stubs/elys-api.stub";
import { cloneData } from "src/app/mock/helpers/clone-mock.helper";

class UserServiceStub {
  dataUserDetail: DataUser;

  constructor() {
    this.dataUserDetail = { userDetail: mockUserData };
  }

  isLoggedOperator(): boolean {
    return false;
  }
}

describe('CouponService', () => {
  let service: CouponService;
  let elysCouponService: ElysCouponServiceStub;
  let elysApiService: ElysApiService;
  let appSettings: AppSettings;
  let userService: UserService;

  beforeEach(() => {
    elysCouponService = new ElysCouponServiceStub();

    TestBed.configureTestingModule({
      providers: [
        CouponService,
        AppSettings,
        { provide: ElysCouponService, useValue: elysCouponService},
        { provide: UserService, useClass: UserServiceStub},
        { provide: PrintCouponService, useValue: {}},
        { provide: ElysApiService, useClass: ElysApiServiceStub},
      ],
    });

    service = TestBed.inject(CouponService);
    elysApiService = TestBed.inject(ElysApiService);
    appSettings = TestBed.inject(AppSettings);
    userService = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should change coupon type when coupon was changed', () => {
    // if coupon is not exist
    let coupon: InternalCoupon = null;
    spyOn(service, 'resetCoupon');

    elysCouponService.couponHasChangedSubject.next(coupon);
    expect(service.resetCoupon).toHaveBeenCalled();

    // if Lottery coupon exist and operator is not logged
    coupon = cloneData(mockCoupon);
    userService.isLoggedOperator = jasmine.createSpy('isLoggedOperator').and.returnValue(false);
    spyOn(service, 'calculateAmounts');
    userService.dataUserDetail = {operatorDetail: cloneData(mockOperatorData)};

    const expectedCoupon: InternalCoupon = {
      ...cloneData(coupon),
      internal_isReadyToPlace: false,
      BettorId: userService.dataUserDetail.operatorDetail.ClientId,
      ClientBettorId: userService.dataUserDetail.operatorDetail.ClientId,
      internal_isLottery: true
    };

    appSettings.products.map(prod => {
      prod.productSelected = prod.layoutProducts.type === LAYOUT_TYPE.KENO;
    });

    service.couponResponse
    .pipe(take(1))
    .subscribe(result => {
      expect(result).toEqual(expectedCoupon);
    });

    elysCouponService.couponHasChangedSubject.next(coupon);

    expect(service.coupon.internal_isLottery).toBeTrue();
    expect(service.coupon.internal_isReadyToPlace).toBeFalse();
    expect(service.calculateAmounts).toHaveBeenCalled();


    // if Colors coupon exist and operator is not logged
    coupon = cloneData(mockCoupon);
    userService.isLoggedOperator = jasmine.createSpy('isLoggedOperator').and.returnValue(true);

    appSettings.products.map(prod => {
      prod.productSelected = prod.layoutProducts.type === LAYOUT_TYPE.COLOURS;
    });

    elysCouponService.couponHasChangedSubject.next(coupon);
    expect(service.coupon.internal_isColours).toBeTrue();
    expect(service.coupon.internal_isReadyToPlace).toBeFalse();


    // if AmericanRoulette coupon exist and operator is not logged
    coupon = cloneData(mockCoupon);
    appSettings.products.map(prod => {
      prod.productSelected = prod.layoutProducts.type === LAYOUT_TYPE.AMERICANROULETTE;
    });

    elysCouponService.couponHasChangedSubject.next(coupon);
    expect(service.coupon.internal_isAmericanRoulette).toBeTrue();
    expect(service.coupon.internal_isReadyToPlace).toBeFalse();
  });

  it('should process different types of messages from the coupon', () => {
    let message: CouponServiceMessage = {
      messageCode: 2,
      messageSource: MessageSource.COUPON_PLACEMENT,
      messageType: CouponServiceMessageType.success
    };

    elysCouponService.couponServiceMessageSubject.next(message)
    expect(service.isWaitingConclusionOperation).toBeTrue();

    message.messageType = CouponServiceMessageType.error;
    message.message = 'error';
    elysCouponService.couponServiceMessageSubject.next(message)
    expect(service.error).toEqual(new Error(message.message, message.messageSource));

    spyOn(service, 'checkLimits');
    message.messageType = CouponServiceMessageType.warning;
    message.message = 'warning';
    elysCouponService.couponServiceMessageSubject.next(message)
    expect(service.checkLimits).toHaveBeenCalled();
    expect(service.warningMessage).toEqual(message.message);
  });

  it('should update oddStakeEdit value', () => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.internal_isReadyToPlace = true;
    const oddStakeEdit: OddsStakeEdit = {
      indexOdd: 0,
      isDefaultInput: false,
      odd: cloneData(mockCoupon.Odds[0]),
      tempStake: 2,
      tempStakeStr: "2",
    };

    service.oddStakeEditSubject.next(oddStakeEdit);
    expect(service.oddStakeEdit).toEqual(oddStakeEdit);
  });

  it('should check the placement status of the coupon', () => {
    // staged coupon type is Placed
    const stagedCoupon = cloneData(mockStagedCoupon);
    stagedCoupon.CouponStatusId = StagedCouponStatus.Placed;

    elysCouponService.stagedCouponSubject.next([stagedCoupon]);

    expect(service.isWaitingConclusionOperation).toBeFalse();
    expect(service.isASuccess).toBeTrue();

    // staged coupon type is not Placed
    stagedCoupon.CouponStatusId = StagedCouponStatus.Canceled;
    elysCouponService.stagedCouponSubject.next([stagedCoupon]);

    expect(service.isWaitingConclusionOperation).toBeFalse();
    expect(service.error).toEqual(new Error('StagedCouponStatus.' + StagedCouponStatus[stagedCoupon.CouponStatusId], MessageSource.COUPON_PLACEMENT));

  });

  it('should add/remove to coupon SC', () => {
    const smart: PolyfunctionalArea = cloneData(mockPolyfunctionalArea);
    const val: string = smart.value.toString().replace('-', '');
    const amount = smart.typeSlipCol === TypeBetSlipColTot.COL ? smart.amount : smart.amount / smart.odds.length;
    const request: AddOddRequestSC = {
      cCat: CouponCategory.Virtual,
      colAmount: amount,
      shortcut: SmartCodeType[smart.shortcut] + val,
      smc: smart.smartBetCode
    };

    service.addRemoveToCouponSC(smart);
    expect(elysCouponService.manageOddSC).toHaveBeenCalledWith(request);
  });

  it('should add to coupon', () => {
    const smart: BetOdd[] = [cloneData(mockBetOdd)];
    const isMultiStake: boolean = true;
    const request: AddOddRequest = {
      add: true,
      cCat: CouponCategory.Virtual,
      colAmount: mockBetOdd.amount,
      isMultipleStake: isMultiStake,
      oddId: mockBetOdd.id,
      selid: mockBetOdd.id
    };

    service.addRemoveToCoupon(smart, isMultiStake);
    expect(service.couponIdAdded.includes(mockBetOdd.id)).toBeTrue();
    expect(elysCouponService.manageOdd).toHaveBeenCalledWith(request);
  });

  it('should remove from coupon', () => {
    const smart: BetOdd[] = [cloneData(mockBetOdd)];
    const isMultiStake: boolean = true;
    const request: AddOddRequest = {
      add: false,
      cCat: CouponCategory.Virtual,
      colAmount: mockBetOdd.amount,
      isMultipleStake: isMultiStake,
      oddId: mockBetOdd.id,
      selid: mockBetOdd.id
    };

    service.coupon = cloneData(mockCoupon);
    service.coupon.Odds[0].SelectionId = mockBetOdd.id;
    service.coupon.internal_isReadyToPlace = false;
    service.couponIdAdded = [mockBetOdd.id];

    service.addRemoveToCoupon(smart, isMultiStake);
    expect(service.couponIdAdded.includes(mockBetOdd.id)).toBeTrue();
    expect(elysCouponService.manageOdd).toHaveBeenCalledWith(request);
  });

  it('should add to coupon lottery', () => {
    const eventId: number = 585374237;
    const selectedNumber: number = 18;
    const amount: number = 1;

    const request: AddNumberRequest = {
      id: eventId,
      number: selectedNumber,
      amount: amount
    };

    service.addToRemoveToCouponLottery(eventId, selectedNumber, amount);
    expect(elysCouponService.manageOddLottery).toHaveBeenCalledWith(request);
  });

  it('should remove from coupon lottery', () => {
    const eventId: number = 585374237;
    const selectedNumber: number = 18;
    const amount: number = 1;

    const request: AddNumberRequest = {
      id: eventId,
      number: selectedNumber,
      amount: amount,
      isDelete: true
    };

    service.coupon = cloneData(mockCoupon);
    const odd1: BetCouponOddExtended = cloneData(service.coupon.Odds[0]);
    const odd2: BetCouponOddExtended = cloneData(service.coupon.Odds[0]);
    odd1.SelectionName = selectedNumber.toString();
    odd2.SelectionName = '23';
    service.coupon.Odds = [odd1, odd2];

    service.addToRemoveToCouponLottery(eventId, selectedNumber, amount);
    expect(elysCouponService.manageOddLottery).toHaveBeenCalledWith(request);
  });

  it('should remove from coupon lottery and reset coupon', () => {
    const eventId: number = 585374237;
    const selectedNumber: number = 18;
    const amount: number = 1;

    service.coupon = cloneData(mockCoupon);
    const odd1: BetCouponOddExtended = service.coupon.Odds[0];
    odd1.SelectionName = selectedNumber.toString();
    service.coupon.Odds = [odd1];

    spyOn(service, 'resetCoupon');
    service.addToRemoveToCouponLottery(eventId, selectedNumber, amount);

    expect(service.resetCoupon).toHaveBeenCalled();
  });

  it('should reset coupon', () => {
    service.coupon = cloneData(mockCoupon);
    service.couponIdAdded = [service.coupon.Odds[0].SelectionId];
    elysCouponService.betCoupon = cloneData(mockCoupon);

    const stakesDisplayTemp: StakesDisplay = {
      TotalStake: 0,
      MaxWinning: 0
    };

    service.couponHasBeenPlacedObs.subscribe(result => {
      expect(result).toBeTrue();
    });

    service.stakeDisplayObs.subscribe(result => {
      expect(result).toEqual(stakesDisplayTemp);
    });

    service.resetCoupon();

    expect(service.coupon).toEqual(null);
    expect(service.couponIdAdded).toEqual([]);
    expect(elysCouponService.betCoupon).toEqual(null);
  });

  it('should add to coupon colors', () => {
    const selectionId: number = 585539727;
    const outcomeType: string = 'bet49';
    const outcome: string = '8';
    const amount: number = 1;

    const req: AddColoursNumberRequest = {
      id: selectionId,
      outcomeType: outcomeType,
      outcome: outcome.replace('+', ''),
      amount: amount
    };

    service.addToRemoveToCouponColours(selectionId, outcomeType, outcome, amount);
    expect(elysCouponService.manageOddColours).toHaveBeenCalledWith(req);
  });

  it('should remove from coupon colors', () => {
    const selectionId: number = 585539727;
    const outcomeType: string = 'bet49';
    const outcome: string = '8';
    const amount: number = 1;

    const req: AddColoursNumberRequest = {
      id: selectionId,
      outcomeType: outcomeType,
      outcome: outcome.replace('+', ''),
      amount: amount,
      isDelete: true
    };

    service.coupon = cloneData(mockCoupon);
    const odd1: BetCouponOddExtended = cloneData(service.coupon.Odds[0]);
    const odd2: BetCouponOddExtended = cloneData(service.coupon.Odds[0]);
    odd1.SelectionName = outcome;
    odd2.SelectionName = '23';
    service.coupon.Odds = [odd1, odd2];

    service.addToRemoveToCouponColours(selectionId, outcomeType, outcome, amount);
    expect(elysCouponService.manageOddColours).toHaveBeenCalledWith(req);
  });

  it('should remove from coupon colors and reset coupon', () => {
    const selectionId: number = 585539727;
    const outcomeType: string = 'bet49';
    const outcome: string = '8';
    const amount: number = 1;

    service.coupon = cloneData(mockCoupon);
    const odd1: BetCouponOddExtended = service.coupon.Odds[0];
    odd1.SelectionName = outcome;
    service.coupon.Odds = [odd1];

    spyOn(service, 'resetCoupon');
    service.addToRemoveToCouponColours(selectionId, outcomeType, outcome, amount);

    expect(service.resetCoupon).toHaveBeenCalled();
  });

  it('should make multi add to coupon colours', () => {
    const selectionId: number = 585574723;
    const outcomeType: string = 'bet49';
    const outcomes: string[] = ['34', '28'];
    const amount: number = 1;

    const req: ColoursMultiSelection = {
      selectionId: selectionId,
      outcomeType: outcomeType,
      outcomes: outcomes,
      amount: amount
    };

    service.multiAddToCouponColours(selectionId, outcomeType, outcomes, amount);
    expect(elysCouponService.manageColoursMultiOddSC).toHaveBeenCalledWith(req);
  });

  it('should calculate stake and winning max and update the grouping', () => {
    service.coupon = cloneData(mockCoupon);
    appSettings.products.filter(prod => prod.productSelected)[0].typeCoupon.acceptMultiStake = true;
    const stakesDisplayTemp: StakesDisplay = {
      MaxWinning: 9.26,
      TotalStake: 1
    };

    const expectedGroupings: BetCouponGroup[] = [{
      Combinations: 6,
      Grouping: 1,
      IsMultiStake: false,
      MaxBonusCombination: 0,
      MaxBonusCombinationUnit: 0,
      MaxBonusUnit: 0,
      MaxWinCombination: 9.26,
      MaxWinCombinationUnit: 55.56,
      MaxWinUnit: 55.56,
      MinBonusUnit: 0,
      MinWinUnit: 33.2,
      Selected: true,
      Stake: 0.16666666666666666
    }];

    service.stakeDisplaySubject.subscribe(result => {
      expect(result).toEqual(stakesDisplayTemp);
    });

    service.calculateAmounts();
    expect(service.coupon.Groupings).toEqual(expectedGroupings);
  });

  it('should calculate stake and winning max', () => {
    service.coupon = cloneData(mockCoupon);
    appSettings.products.filter(prod => prod.productSelected)[0].typeCoupon.acceptMultiStake = false;
    const stakesDisplayTemp: StakesDisplay = {
      MaxWinning: 55.56,
      TotalStake: 6
    };

    service.stakeDisplaySubject.subscribe(result => {
      expect(result).toEqual(stakesDisplayTemp);
    });

    service.calculateAmounts();
    expect(service.coupon.Stake).toEqual(stakesDisplayTemp.TotalStake);
  });

  it('should update coupon Lottery', () => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.internal_isLottery = true;
    service.coupon.internal_isColours = false;
    const oddStakeEdit: OddsStakeEdit = {
      indexOdd: 0,
      isDefaultInput: false,
      odd: cloneData(mockCoupon.Odds[0]),
      tempStake: 2,
      tempStakeStr: "2",
    };

    service.oddStakeEdit = oddStakeEdit;
    service.oddStakeEditSubject.subscribe(result => {
      expect(result).toEqual(null);
    });

    service.updateCoupon();

    expect(elysCouponService.updateCouponLottery).toHaveBeenCalledWith(service.coupon);
    expect(service.coupon.Odds[oddStakeEdit.indexOdd].OddStake).toEqual(oddStakeEdit.tempStake);
  });

  it('should update coupon Colors', () => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.internal_isLottery = false;
    service.coupon.internal_isColours = true;
    const oddStakeEdit: OddsStakeEdit = {
      indexOdd: 0,
      isDefaultInput: false,
      odd: cloneData(mockCoupon.Odds[0]),
      tempStake: 2,
      tempStakeStr: "2",
    };

    service.oddStakeEdit = oddStakeEdit;
    service.oddStakeEditSubject.subscribe(result => {
      expect(result).toEqual(null);
    });

    service.updateCoupon();

    expect(elysCouponService.updateCouponColours).toHaveBeenCalledWith(service.coupon);
    expect(service.coupon.Odds[oddStakeEdit.indexOdd].OddStake).toEqual(oddStakeEdit.tempStake);
  });

  it('should update coupon', () => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.internal_isLottery = false;
    service.coupon.internal_isColours = false;
    const oddStakeEdit: OddsStakeEdit = {
      indexOdd: 0,
      isDefaultInput: false,
      odd: cloneData(mockCoupon.Odds[0]),
      tempStake: 2,
      tempStakeStr: "2",
    };

    service.oddStakeEdit = oddStakeEdit;
    service.oddStakeEditSubject.subscribe(result => {
      expect(result).toEqual(null);
    });

    service.updateCoupon();

    expect(elysCouponService.updateCoupon).toHaveBeenCalledWith(service.coupon);
    expect(service.coupon.Odds[oddStakeEdit.indexOdd].OddStake).toEqual(oddStakeEdit.tempStake);
  });

  it('should check odd to change stake', () => {
    service.coupon = cloneData(mockCoupon);
    const odd: BetCouponOdd = cloneData(mockCoupon.Odds[0]);
    const tempOdd: OddsStakeEdit = {
      indexOdd: 0,
      tempStake: 0.0,
      odd: odd,
      isDefaultInput: false
    };

    service.oddStakeEditSubject.subscribe(result => {
      expect(result).toEqual(tempOdd);
    });

    service.checkOddToChangeStake(odd);
  });

  it('should check odd to change stake and reset it', () => {
    service.oddStakeEdit = {
      indexOdd: 0,
      isDefaultInput: false,
      odd: cloneData(mockCoupon.Odds[0]),
      tempStake: 2,
      tempStakeStr: "2",
    };
    const odd: BetCouponOdd = cloneData(mockCoupon.Odds[0]);

    service.oddStakeEditSubject.subscribe(result => {
      expect(result).toEqual(null);
    });

    service.checkOddToChangeStake(odd);
  });

  it('should check grouping to change stake', () => {
    service.coupon = cloneData(mockCoupon);
    const grouping: BetCouponGroup = cloneData(mockCoupon.Groupings[0]);

    const tempOdd: OddsStakeEdit = {
      indexOdd: 0,
      tempStake: 0.0,
      odd: null,
      grouping: grouping,
      isDefaultInput: false
    };

    service.oddStakeEditSubject.subscribe(result => {
      expect(result).toEqual(tempOdd);
    });

    service.checkGroupingToChangeStake(grouping);
  });

  it('should check grouping to change stake and reset odd', () => {
    const grouping: BetCouponGroup = cloneData(mockCoupon.Groupings[0]);
    service.oddStakeEdit = {
      indexOdd: 0,
      isDefaultInput: false,
      odd: cloneData(mockCoupon.Odds[0]),
      tempStake: 2,
      tempStakeStr: "2",
      grouping: cloneData(mockCoupon.Groupings[0])
    }

    service.oddStakeEditSubject.subscribe(result => {
      expect(result).toEqual(null);
    });

    service.checkGroupingToChangeStake(grouping);
  });

  it('should check limits for single bet and show MaxBetWin error', () => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.CouponTypeId = CouponType.SingleBet;

    const maxBetWin = service.coupon.CouponLimit.MaxSingleBetWin < service.coupon.UserCouponLimit.MaxLoss
      ? service.coupon.CouponLimit.MaxSingleBetWin
      : service.coupon.UserCouponLimit.MaxLoss;

    service.stakeDisplay = {
      TotalStake: 6,
      MaxWinning: maxBetWin + 1
    };

    const error: Error = new Error();
    error.setError(CouponLimit[CouponLimit.MaxSingleBetWin], MessageSource.UNKNOWN, maxBetWin);

    service.checkLimits();
    expect(service.error).toEqual(error);
  });

  it('should check limits for single bet with multistake acceptance and show MinBetStake error', () => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.CouponTypeId = CouponType.SingleBet;
    service.coupon.CouponLimit.MinBetStake = service.coupon.Odds[0].OddStake + 1;
    appSettings.products.filter(product => product.productSelected)[0].typeCoupon.acceptMultiStake = true;

    const error: Error = new Error();
    error.setError(
      CouponLimit[CouponLimit.MinBetStake],
      MessageSource.UNKNOWN,
      service.coupon.CouponLimit.MinBetStake,
      service.coupon.Odds[0].SelectionId
    );

    service.checkLimits();
    expect(service.error).toEqual(error);
  });

  it('should check limits for single bet with multistake acceptance and show MaxBetStake error', () => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.CouponTypeId = CouponType.SingleBet;
    appSettings.products.filter(product => product.productSelected)[0].typeCoupon.acceptMultiStake = true;

    const maxBetStake = service.coupon.CouponLimit.MaxBetStake < service.coupon.UserCouponLimit.MaxStake
      ? service.coupon.CouponLimit.MaxBetStake
      : service.coupon.UserCouponLimit.MaxStake;

    service.coupon.Odds[0].OddStake = maxBetStake + 1;

    const error: Error = new Error();
    error.setError(
      CouponLimit[CouponLimit.MaxBetStake],
      MessageSource.UNKNOWN,
      maxBetStake,
      service.coupon.Odds[0].SelectionId
    );

    service.checkLimits();
    expect(service.error).toEqual(error);
  });

  it('should check limits for single bet and show MaxBetStake error', () => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.CouponTypeId = CouponType.SingleBet;
    appSettings.products.filter(product => product.productSelected)[0].typeCoupon.acceptMultiStake = false;

    const maxBetStake = service.coupon.CouponLimit.MaxBetStake < service.coupon.UserCouponLimit.MaxStake
      ? service.coupon.CouponLimit.MaxBetStake
      : service.coupon.UserCouponLimit.MaxStake;

    service.coupon.Stake = maxBetStake + 1

    const error: Error = new Error();
    error.setError(
      CouponLimit[CouponLimit.MaxBetStake],
      MessageSource.UNKNOWN,
      maxBetStake,
      service.coupon.Odds[0].SelectionId
    );

    service.checkLimits();
    expect(service.error).toEqual(error);
  });

  it('should check limits for single bet and show MinBetStake error', () => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.CouponTypeId = CouponType.SingleBet;
    service.coupon.CouponLimit.MinBetStake = service.coupon.Stake + 1;
    appSettings.products.filter(product => product.productSelected)[0].typeCoupon.acceptMultiStake = false;

    const error: Error = new Error();
    error.setError(
      CouponLimit[CouponLimit.MinBetStake],
      MessageSource.UNKNOWN,
      service.coupon.CouponLimit.MinBetStake,
      service.coupon.Odds[0].SelectionId
    );

    service.checkLimits();
    expect(service.error).toEqual(error);
  });

  it('should check limits for multiple bet and show MaxBetStake error', () => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.CouponTypeId = CouponType.MultipleBet;
    appSettings.products.filter(product => product.productSelected)[0].typeCoupon.acceptMultiStake = false;

    const maxBetStake = service.coupon.CouponLimit.MaxBetStake < service.coupon.UserCouponLimit.MaxStake
      ? service.coupon.CouponLimit.MaxBetStake
      : service.coupon.UserCouponLimit.MaxStake;

    service.coupon.Stake = maxBetStake + 1;

    const error: Error = new Error();
    error.setError(
      CouponLimit[CouponLimit.MaxBetStake],
      MessageSource.UNKNOWN,
      maxBetStake,
      service.coupon.Odds[0].SelectionId
    );

    service.checkLimits();
    expect(service.error).toEqual(error);
  });

  it('should check limits for multiple bet and show MinBetStake error', () => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.CouponTypeId = CouponType.MultipleBet;
    service.coupon.CouponLimit.MinBetStake = service.coupon.Stake + 1;
    appSettings.products.filter(product => product.productSelected)[0].typeCoupon.acceptMultiStake = false;

    const error: Error = new Error();
    error.setError(
      CouponLimit[CouponLimit.MinBetStake],
      MessageSource.UNKNOWN,
      service.coupon.CouponLimit.MinBetStake,
      service.coupon.Odds[0].SelectionId
    );

    service.checkLimits();
    expect(service.error).toEqual(error);
  });

  it('should check limits for combinations bet and show MaxBetStake error', () => {
    service.coupon = cloneData(mockCoupon);

    const maxBetStake = service.coupon.CouponLimit.MaxBetStake < service.coupon.UserCouponLimit.MaxStake
      ? service.coupon.CouponLimit.MaxBetStake
      : service.coupon.UserCouponLimit.MaxStake;

    service.stakeDisplay = {
      TotalStake: maxBetStake + 1,
      MaxWinning: 215.34
    };

    const error: Error = new Error();
    error.setError(CouponLimit[CouponLimit.MaxBetStake], MessageSource.UNKNOWN, maxBetStake);

    service.checkLimits();
    expect(service.error).toEqual(error);
  });

  it('should check limits for combinations bet and show MaxBetWin error', () => {
    service.coupon = cloneData(mockCoupon);

    const maxBetWin = service.coupon.CouponLimit.MaxCombinationBetWin < service.coupon.UserCouponLimit.MaxLoss
      ? service.coupon.CouponLimit.MaxCombinationBetWin
      : service.coupon.UserCouponLimit.MaxLoss;

    service.stakeDisplay = {
      TotalStake: 6,
      MaxWinning: maxBetWin + 1
    };

    const error: Error = new Error();
    error.setError(CouponLimit[CouponLimit.MaxCombinationBetWin], MessageSource.UNKNOWN, maxBetWin);

    service.checkLimits();
    expect(service.error).toEqual(error);
  });

  it('should check limits for combinations bet and show MinGroupingsBetStake error', () => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.Groupings[0].Selected = true;
    service.coupon.CouponLimit.MinGroupingsBetStake = service.coupon.Groupings[0].Stake + 1;

    service.stakeDisplay = {
      TotalStake: 6,
      MaxWinning: 215.34
    };

    const error: Error = new Error();
    error.setError(
      CouponLimit[CouponLimit.MinGroupingsBetStake],
      MessageSource.UNKNOWN,
      service.coupon.CouponLimit.MinGroupingsBetStake,
      service.coupon.Odds[0].SelectionId
    );

    service.checkLimits();
    expect(service.error).toEqual(error);
  });

  it('should check limits for combinations bet and show MaxGroupingsBetStake error', () => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.Groupings[0].Selected = true;
    service.coupon.CouponLimit.MaxGroupingsBetStake = service.coupon.Groupings[0].Stake - 1;

    service.stakeDisplay = {
      TotalStake: 6,
      MaxWinning: 215.34
    };

    const error: Error = new Error();
    error.setError(
      CouponLimit[CouponLimit.MaxGroupingsBetStake],
      MessageSource.UNKNOWN,
      service.coupon.CouponLimit.MaxGroupingsBetStake,
      service.coupon.Odds[0].SelectionId
    );

    service.checkLimits();
    expect(service.error).toEqual(error);
  });

  it('should check limits for combinations bet and show MaxSingleBetWin error', () => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.Groupings[0].Selected = true;
    service.coupon.Groupings[0].Grouping = 1;
    service.coupon.Groupings[0].MaxWinCombination = service.coupon.CouponLimit.MaxSingleBetWin + 1;

    const singleWin = service.coupon.Groupings[0].Stake * service.coupon.Odds[0].OddValue;
    service.coupon.CouponLimit.MaxSingleBetWin = singleWin - 1;

    service.stakeDisplay = {
      TotalStake: 6,
      MaxWinning: 215.34
    };

    const error: Error = new Error();
    error.setError(
      CouponLimit[CouponLimit.MaxSingleBetWin],
      MessageSource.UNKNOWN,
      service.coupon.CouponLimit.MaxSingleBetWin,
      service.coupon.Odds[0].SelectionId
    );

    service.checkLimits();
    expect(service.error).toEqual(error);
  });

  it('should prestage coupon for Lottery', async() => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.internal_isLottery = true;
    service.coupon.internal_isColours = false;
    service.coupon.internal_isReadyToPlace = false;
    appSettings.couponDirectPlace = true;

    spyOn(service, 'stagedCoupon');
    await service.preStagedCoupon();

    expect(elysCouponService.updateCouponLottery).toHaveBeenCalledWith(service.coupon);
    expect(service.coupon.internal_isReadyToPlace).toBeTrue();
    expect(service.stagedCoupon).toHaveBeenCalled();
  });

  it('should prestage coupon for Colors', async() => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.internal_isLottery = false;
    service.coupon.internal_isColours = true;
    service.coupon.internal_isReadyToPlace = false;
    appSettings.couponDirectPlace = true;

    spyOn(service, 'stagedCoupon');
    await service.preStagedCoupon();

    expect(elysCouponService.updateCouponColours).toHaveBeenCalledWith(service.coupon);
    expect(service.coupon.internal_isReadyToPlace).toBeTrue();
    expect(service.stagedCoupon).toHaveBeenCalled();
  });

  it('should prestage coupon ', async() => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.internal_isLottery = false;
    service.coupon.internal_isColours = false;
    service.coupon.internal_isReadyToPlace = false;
    appSettings.couponDirectPlace = true;

    spyOn(service, 'stagedCoupon');
    await service.preStagedCoupon();

    expect(elysCouponService.updateCoupon).toHaveBeenCalledWith(service.coupon);
    expect(service.coupon.internal_isReadyToPlace).toBeTrue();
    expect(service.stagedCoupon).toHaveBeenCalled();
  });

  it('should check if coupon is ready to place', () => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.internal_isReadyToPlace = true;

    const result: boolean = service.checkIfCouponIsReadyToPlace();
    expect(result).toEqual(service.coupon.internal_isReadyToPlace);
  });

  it('should cancel staging coupon', () => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.internal_isReadyToPlace = true;

    service.cancelStagingCoupon();
    expect(service.coupon.internal_isReadyToPlace).toBeFalse();
  });

  it('should place coupon for Lottery', () => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.internal_isLottery = true;

    service.stagedCoupon();
    expect(elysCouponService.placeCouponLottery).toHaveBeenCalledWith(service.coupon);
  });

  it('should place coupon for Colors', () => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.internal_isLottery = false;
    service.coupon.internal_isColours = true;

    service.stagedCoupon();
    expect(elysCouponService.placeCouponColours).toHaveBeenCalledWith(service.coupon);
  });

  it('should place coupon', () => {
    service.coupon = cloneData(mockCoupon);
    service.coupon.internal_isLottery = false;
    service.coupon.internal_isColours = false;

    service.stagedCoupon();
    expect(elysCouponService.placeCoupon).toHaveBeenCalledWith(service.coupon);
  });

  it('should make the payment of a coupon', () => {
    const request: FlagAsPaidRequest = {
      CouponId: 77218315,
      TicketCode: 'ticket_code',
      IsPaid: true,
      SettlingClientId: 77218315,
      Product: 'DOG'
    };

    service.flagAsPaidCoupon(request);
    expect(elysApiService.coupon.flagAsPaidCoupon).toHaveBeenCalledWith(request);
  });

  it('should cancel coupon', () => {
    const request: CancelCouponRequest = {
      CancellationRequestUserId: 1,
      ShopClientId: 1243,
      CouponId: 77218315,
      TicketCode: 'ticket_code',
      Product: 'DOG'
    };

    service.cancelCoupon(request);
    expect(elysApiService.coupon.cancelCoupon).toHaveBeenCalledWith(request);
  });

  it('should set productHasCoupon to true', () => {
    service.coupon = cloneData(mockCoupon);
    service.productHasCoupon = { checked: false };

    service.checkHasCoupon();
    expect(service.productHasCoupon.checked).toBeTrue();
  });

  it('should set productHasCoupon to false', () => {
    service.coupon = null;
    service.productHasCoupon = { checked: true };

    service.checkHasCoupon();
    expect(service.productHasCoupon.checked).toBeFalse();
  });

  it('should reset productHasCoupon value', () => {
    service.productHasCoupon = {
      checked: true,
      productCodeRequest: 'DOG',
    }

    const expected: CouponConfirmDelete = {
      checked: false,
      productCodeRequest: '',
      isRacing: false,
      eventNumber: 0
    };

    service.resetProductHasCoupon();
    expect(service.productHasCoupon).toEqual(expected);
  });
});

