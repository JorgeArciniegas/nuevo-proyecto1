import { TestBed } from "@angular/core/testing";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { skip } from "rxjs/operators";
import { AppSettings } from "src/app/app.settings";
import { mockCoupon, mockPolyfunctionalArea } from "src/app/mock/coupon.mock";
import { cloneData } from "src/app/mock/helpers/clone-mock.helper";
import { mockProduct } from "src/app/mock/product.mock";
import { CouponServiceStub } from "src/app/mock/stubs/coupon-service.stub";
import { mockUserData } from "src/app/mock/user.mock";
import { SmartCodeType, TypeBetSlipColTot } from "src/app/products/main/main.models";
import { PolyfunctionalArea, PolyfunctionalStakeCoupon, PolyfunctionStakePresetPlayer } from "src/app/products/products.model";
import { ProductsService } from "src/app/products/products.service";
import { DataUser } from "src/app/services/user.models";
import { UserService } from "src/app/services/user.service";
import { RouterService } from "src/app/services/utility/router/router.service";
import { TranslateUtilityService } from "src/app/shared/language/translate-utility.service";
import { LAYOUT_TYPE, Products } from "src/environments/environment.models";
import { OddsStakeEdit } from "../coupon/coupon.model";
import { CouponService } from "../coupon/coupon.service";
import { TYPINGTYPE } from "./btncalc.enum";
import { BtncalcService } from "./btncalc.service";

const mockOddStakeEdit: OddsStakeEdit = {
  indexOdd: 0,
  isDefaultInput: false,
  odd: cloneData(mockCoupon.Odds[0]),
  tempStake: 2,
  tempStakeStr: "2",
};

const mockPolyfunctionalStakeCoupon: PolyfunctionalStakeCoupon = {
  columnAmount: 0,
  columns: 0,
  digitAmount: 0,
  hasDecimalSeparator: false,
  isEnabled: true,
  totalAmount: 0,
  typeSlipCol: 0
};

class ProductsServiceStub {
  polyfunctionalAreaSubject: BehaviorSubject<PolyfunctionalArea>;
  polyfunctionalAreaObservable: Observable<PolyfunctionalArea>;

  polyfunctionalStakeCouponSubject: Subject<PolyfunctionalStakeCoupon>;
  polyfunctionalStakeCouponObs: Observable<PolyfunctionalStakeCoupon>;

  product: Products;

  constructor() {
    this.polyfunctionalAreaSubject = new BehaviorSubject<PolyfunctionalArea>(new PolyfunctionalArea());
    this.polyfunctionalAreaObservable = this.polyfunctionalAreaSubject.asObservable();

    this.polyfunctionalStakeCouponSubject = new Subject<PolyfunctionalStakeCoupon>();
    this.polyfunctionalStakeCouponObs = this.polyfunctionalStakeCouponSubject.asObservable();
  }

  closeProductDialog = jasmine.createSpy('closeProductDialog');
  resetBoard = jasmine.createSpy('resetBoard');
}

class TranslateUtilityServiceStub {
  getCurrentLanguage = jasmine.createSpy('getCurrentLanguage');
}

class UserServiceStub {
  isModalOpen: boolean;
  isBtnCalcEditable: boolean;

  dataUserDetail: DataUser;
  userCurrency: string;
}

describe('BtncalcService', () => {
  let service: BtncalcService;
  let productService: ProductsService;
  let translateUtilityService: TranslateUtilityService;
  let userService: UserService;
  let couponService: CouponServiceStub;
  let appSetting: AppSettings;

  beforeEach(() => {
    couponService = new CouponServiceStub();

    TestBed.configureTestingModule({
      providers: [
        BtncalcService,
        AppSettings,
        { provide: ProductsService, useClass: ProductsServiceStub },
        { provide: TranslateUtilityService, useClass: TranslateUtilityServiceStub },
        { provide: UserService, useClass: UserServiceStub },
        { provide: CouponService, useValue: couponService },
        { provide: RouterService, useValue: {} }
      ],
    });

    service = TestBed.inject(BtncalcService);
    productService = TestBed.inject(ProductsService);
    translateUtilityService = TestBed.inject(TranslateUtilityService);
    userService = TestBed.inject(UserService);
    appSetting = TestBed.inject(AppSettings);


    service.polyfunctionalStakeCoupon = cloneData(mockPolyfunctionalStakeCoupon);
    service.polyfunctionalArea = cloneData(mockPolyfunctionalArea);
    service.polyfunctionStakePresetPlayer = {
      amount: 2,
      amountStr: "2",
      disableInputCalculator: false,
      firstTap: false,
      hasDecimalSeparator: false,
      isPreset: false,
      typeSlipCol: 2,
      typingType: TYPINGTYPE.BY_KEYBOARD
    };

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize couponHasBeenPlaced subscription', () => {
    spyOn(service, 'settingStakePresetPlayer');
    spyOn(service, 'checkSeparator');

    service.initializeSubscriptionAndData();
    couponService.couponHasBeenPlacedSub.next(true);

    expect(service.settingStakePresetPlayer).toHaveBeenCalled();
    expect(service.checkSeparator).toHaveBeenCalled();
    expect(service.settingStakePresetPlayer).toHaveBeenCalled();
  });

  it('should initialize polyfunctionalArea subscription with Tot TypeBetSlip', () => {
    productService.product = cloneData(mockProduct);
    productService.product.layoutProducts.type = LAYOUT_TYPE.KENO;

    service.polyfunctionalArea = cloneData(mockPolyfunctionalArea);
    service.polyfunctionalArea.odds = [];

    const element: PolyfunctionalArea = cloneData(mockPolyfunctionalArea);
    element.typeSlipCol = TypeBetSlipColTot.TOT;

    let amount: number = element.amount / element.odds.length;

    service.initializeSubscriptionAndData();
    productService.polyfunctionalAreaSubject.next(element);

    expect(service.polyfunctionStakePresetPlayer.firstTap).toBeTrue();
    expect(service.polyfunctionalArea.activeDistributionTot).toBeTrue();
    expect(service.polyfunctionalArea.activeAssociationCol).toBeTrue();
    expect(service.polyfunctionalArea.odds[0].amount).toEqual(amount);
    expect(service.polyfunctionalArea.typeSlipCol).toEqual(TypeBetSlipColTot.GROUP);
  });

  it('should initialize polyfunctionalArea subscription', () => {
    const element: PolyfunctionalArea = cloneData(mockPolyfunctionalArea);
    element.typeSlipCol = TypeBetSlipColTot.COL;

    let amount: number = element.amount;

    service.initializeSubscriptionAndData();
    productService.polyfunctionalAreaSubject.next(element);

    expect(service.polyfunctionalArea.activeDistributionTot).toBeTrue();
    expect(service.polyfunctionalArea.activeAssociationCol).toBeTrue();
    expect(service.polyfunctionalArea.odds[0].amount).toEqual(amount);
  });

  it('should initialize polyfunctionalStakeCoupon subscription', () => {
    const polyfunctionalStakeCoupon: PolyfunctionalStakeCoupon = cloneData(mockPolyfunctionalStakeCoupon);

    service.initializeSubscriptionAndData();
    productService.polyfunctionalStakeCouponSubject.next(polyfunctionalStakeCoupon);

    expect(service.polyfunctionalStakeCoupon).toEqual(polyfunctionalStakeCoupon);
  });

  it('should update coupon when user press plus button', () => {
    spyOn(service, 'assignStake');
    userService.isModalOpen = true;
    couponService.oddStakeEdit = cloneData(mockOddStakeEdit);

    service.tapPlus();

    expect(service.assignStake).toHaveBeenCalled()
    expect(userService.isBtnCalcEditable).toBeFalse();
    expect(couponService.updateCoupon).toHaveBeenCalled();
  });

  it('should update coupon stake when user press plus button', () => {
    spyOn(service, 'assignStake');
    spyOn(service, 'updateCouponStake');

    couponService.oddStakeEdit = null;
    service.polyfunctionalStakeCoupon.isEnabled = true;

    service.tapPlus();

    expect(service.assignStake).toHaveBeenCalled()
    expect(service.updateCouponStake).toHaveBeenCalled();
  });

  it('should add or remove odd to couponSC when user press plus button', () => {
    spyOn(service, 'assignStake');

    couponService.oddStakeEdit = null;
    service.polyfunctionalStakeCoupon.isEnabled = false;
    service.polyfunctionalArea.shortcut = SmartCodeType["1PX"];

    service.tapPlus();

    expect(service.assignStake).toHaveBeenCalled()
    expect(couponService.addRemoveToCouponSC).toHaveBeenCalledWith(service.polyfunctionalArea);
  });

  it('should add or remove odd to coupon when user press plus button', () => {
    spyOn(service, 'assignStake');

    couponService.oddStakeEdit = null;
    service.polyfunctionalStakeCoupon.isEnabled = false;
    service.polyfunctionalArea.shortcut = null;

    productService.product = cloneData(mockProduct);
    productService.product.sportId = 8;

    let listOdds = service.polyfunctionalArea.odds.slice();

    service.tapPlus();

    expect(service.assignStake).toHaveBeenCalled()
    expect(couponService.addRemoveToCoupon).toHaveBeenCalledWith(listOdds, productService.product.typeCoupon.acceptMultiStake);
  });

  it('should add or remove odd to Soccer coupon when user press plus button', () => {
    spyOn(service, 'assignStake');

    couponService.oddStakeEdit = null;
    service.polyfunctionalStakeCoupon.isEnabled = false;
    service.polyfunctionalArea.shortcut = null;

    productService.product = cloneData(mockProduct);
    productService.product.sportId = 1;

    let listOdds = service.polyfunctionalArea.odds.slice(-1);

    service.tapPlus(false);

    expect(service.assignStake).toHaveBeenCalled()
    expect(couponService.addRemoveToCoupon).toHaveBeenCalledWith(listOdds, productService.product.typeCoupon.acceptMultiStake);
    expect(productService.closeProductDialog).toHaveBeenCalled();
    expect(productService.resetBoard).toHaveBeenCalled();
  });

  it('should update coupon when try to add or remove Lottery number to coupon', () => {
    const selection = 26;
    const eventId = 589149827;

    userService.isModalOpen = true;
    couponService.oddStakeEdit = cloneData(mockOddStakeEdit);

    service.lotteryPushToCoupon(selection, eventId);

    expect(userService.isBtnCalcEditable).toEqual(false);
    expect(couponService.updateCoupon).toHaveBeenCalled();
  });

  it('should update coupon stake when try to add or remove Lottery number to coupon', () => {
    const selection = 26;
    const eventId = 589149827;

    couponService.oddStakeEdit = null;
    service.polyfunctionalStakeCoupon.isEnabled = true;

    spyOn(service, 'updateCouponStakeLottery');
    service.lotteryPushToCoupon(selection, eventId);

    expect(service.updateCouponStakeLottery).toHaveBeenCalled();
  });

  it('should add or remove Lottery number to coupon', () => {
    const selection = 26;
    const eventId = 589149827;

    couponService.oddStakeEdit = null;
    service.polyfunctionalStakeCoupon.isEnabled = false;

    service.lotteryPushToCoupon(selection, eventId);

    expect(couponService.addToRemoveToCouponLottery).toHaveBeenCalledWith(eventId, selection, service.polyfunctionalArea.amount);
  });

  it('should update coupon when try to add or remove Colors number to coupon', () => {
    const selectionId: number = 589241442;
    const outcomeType: string = 'bet49';
    const outcome: string = '9';

    userService.isModalOpen = true;
    couponService.oddStakeEdit = cloneData(mockOddStakeEdit);

    service.coloursPushToCoupon(selectionId, outcomeType, outcome);

    expect(userService.isBtnCalcEditable).toEqual(false);
    expect(couponService.updateCoupon).toHaveBeenCalled();
  });

  it('should update coupon stake when try to add or remove Colors number to coupon', () => {
    const selectionId: number = 589241442;
    const outcomeType: string = 'bet49';
    const outcome: string = '9';

    couponService.oddStakeEdit = null;
    service.polyfunctionalStakeCoupon.isEnabled = true;

    spyOn(service, 'updateCouponStakeColours');
    service.coloursPushToCoupon(selectionId, outcomeType, outcome);

    expect(service.updateCouponStakeColours).toHaveBeenCalled();
  });

  it('should add or remove Color number to coupon', () => {
    const selectionId: number = 589241442;
    const outcomeType: string = 'bet49';
    const outcome: string = '9';

    couponService.oddStakeEdit = null;
    service.polyfunctionalStakeCoupon.isEnabled = false;

    service.coloursPushToCoupon(selectionId, outcomeType, outcome);

    //console.log("service.polyfunctionalArea", service.polyfunctionalArea)

    expect(couponService.addToRemoveToCouponColours).toHaveBeenCalledWith(
      selectionId,
      outcomeType,
      outcome,
      service.polyfunctionStakePresetPlayer.amount
    );
  });

  it('should update coupon when try to add or remove multiple Colors number to coupon', () => {
    const selectionId: number = 589241442;
    const outcomeType: string = 'bet49';
    const outcome: string[] = ['9'];

    userService.isModalOpen = true;
    couponService.oddStakeEdit = cloneData(mockOddStakeEdit);

    service.coloursMultiPushToCoupon(selectionId, outcomeType, outcome);

    expect(userService.isBtnCalcEditable).toEqual(false);
    expect(couponService.updateCoupon).toHaveBeenCalled();
  });

  it('should update coupon stake when try to add or remove multiple Colors number to coupon', () => {
    const selectionId: number = 589241442;
    const outcomeType: string = 'bet49';
    const outcome: string[] = ['9'];

    couponService.oddStakeEdit = null;
    service.polyfunctionalStakeCoupon.isEnabled = true;

    spyOn(service, 'updateCouponStakeColours');
    service.coloursMultiPushToCoupon(selectionId, outcomeType, outcome);

    expect(service.updateCouponStakeColours).toHaveBeenCalled();
  });

  it('should add or remove multiple Colors number to coupon', () => {
    const selectionId: number = 589241442;
    const outcomeType: string = 'bet49';
    const outcome: string[] = ['9'];

    couponService.oddStakeEdit = null;
    service.polyfunctionalStakeCoupon.isEnabled = false;

    service.coloursMultiPushToCoupon(selectionId, outcomeType, outcome);

    expect(couponService.multiAddToCouponColours).toHaveBeenCalledWith(
      selectionId,
      outcomeType,
      outcome,
      service.polyfunctionStakePresetPlayer.amount
    );
  });

  it('should update coupon stake', () => {
    couponService.coupon = cloneData(mockCoupon);
    service.polyfunctionalStakeCoupon.isEnabled = true;

    spyOn(service, 'clearAll');
    service.updateCouponStake();

    expect(couponService.coupon.Odds[0].OddStake).toEqual(service.polyfunctionalStakeCoupon.columnAmount);
    expect(couponService.updateCoupon).toHaveBeenCalled();
    expect(service.clearAll).toHaveBeenCalled();
  });

  it('should update coupon stake Lottery', () => {
    couponService.coupon = cloneData(mockCoupon);

    productService.polyfunctionalAreaObservable
    .pipe( skip(1) )
    .subscribe(result => {
      expect(result).toEqual(service.polyfunctionalArea);
    });

    service.updateCouponStakeLottery();

    expect(couponService.updateCoupon).toHaveBeenCalled();
    expect(couponService.coupon.Groupings[0].Stake).toEqual(service.polyfunctionStakePresetPlayer.amount);
    expect(couponService.coupon.Stake).toEqual(service.polyfunctionStakePresetPlayer.amount);
  });

  it('should update coupon stake Colors', () => {
    couponService.coupon = cloneData(mockCoupon);

    productService.polyfunctionalAreaObservable
    .pipe( skip(1) )
    .subscribe(result => {
      expect(result).toEqual(service.polyfunctionalArea);
    });

    service.updateCouponStakeColours();

    expect(couponService.updateCoupon).toHaveBeenCalled();
    expect(couponService.coupon.Groupings[0].Stake).toEqual(service.polyfunctionStakePresetPlayer.amount);
    expect(couponService.coupon.Stake).toEqual(service.polyfunctionStakePresetPlayer.amount);
  });

  it('should clear all', () => {
    service.productService.polyfunctionalStakeCouponObs.subscribe(result => {
      expect(result).toEqual(new PolyfunctionalStakeCoupon());
    });

    service.clearAll();

    expect(productService.closeProductDialog).toHaveBeenCalled();
    expect(productService.resetBoard).toHaveBeenCalled();
    expect(service.polyfunctionalArea.amount).toEqual(1);
    expect(service.polyfunctionalAdditionFlag).toBeTrue();
    expect(service.polyfunctionalDecimalsFlag).toBeTrue();
  });

  it('should check separator', () => {
    userService.dataUserDetail = { userDetail: mockUserData };
    userService.userCurrency = 'USD';

    const expectedSeparator: string = '.';
    service.decimalSeparator = null;

    translateUtilityService.getCurrentLanguage = jasmine.createSpy('getCurrentLanguage').and.returnValue('en');
    service.checkSeparator();

    expect(service.decimalSeparator).toEqual(expectedSeparator);
  });

  it('should setting stake for Player for Keno sport', () => {
    productService.product =  cloneData(mockProduct);
    productService.product.layoutProducts.type = LAYOUT_TYPE.KENO;
    appSetting.defaultAmount.PresetOne = 1;

    const expectedPolyfunctionStakePresetPlayer = new PolyfunctionStakePresetPlayer(
      TypeBetSlipColTot.GROUP,
      appSetting.defaultAmount.PresetOne
    );

    service.polyfunctionStakePresetPlayerObs.subscribe(result => {
      expect(result).toEqual(expectedPolyfunctionStakePresetPlayer);
    });

    service.settingStakePresetPlayer();
    expect(service.polyfunctionStakePresetPlayer).toEqual(expectedPolyfunctionStakePresetPlayer);
  });

  it('should setting stake for Player for Colors sport', () => {
    productService.product =  cloneData(mockProduct);
    productService.product.layoutProducts.type = LAYOUT_TYPE.COLOURS;
    appSetting.defaultAmount.PresetOne = 1;

    const expectedPolyfunctionStakePresetPlayer = new PolyfunctionStakePresetPlayer(
      TypeBetSlipColTot.GROUP,
      appSetting.defaultAmount.PresetOne
    );

    service.polyfunctionStakePresetPlayerObs.subscribe(result => {
      expect(result).toEqual(expectedPolyfunctionStakePresetPlayer);
    });

    service.settingStakePresetPlayer();
    expect(service.polyfunctionStakePresetPlayer).toEqual(expectedPolyfunctionStakePresetPlayer);
  });

  it('should setting stake for Player for Racing sport', () => {
    productService.product =  cloneData(mockProduct);
    productService.product.layoutProducts.type = LAYOUT_TYPE.RACING;
    appSetting.defaultAmount.PresetOne = 1;

    const expectedPolyfunctionStakePresetPlayer = new PolyfunctionStakePresetPlayer(
      TypeBetSlipColTot.COL,
      appSetting.defaultAmount.PresetOne
    );

    service.polyfunctionStakePresetPlayerObs.subscribe(result => {
      expect(result).toEqual(expectedPolyfunctionStakePresetPlayer);
    });

    service.settingStakePresetPlayer();
    expect(service.polyfunctionStakePresetPlayer).toEqual(expectedPolyfunctionStakePresetPlayer);
  });

  it('should setting the default stake for Player for Keno sport', () => {
    productService.product =  cloneData(mockProduct);
    productService.product.layoutProducts.type = LAYOUT_TYPE.KENO;
    appSetting.defaultAmount.PresetOne = null;

    const expectedPolyfunctionStakePresetPlayer = new PolyfunctionStakePresetPlayer(
      TypeBetSlipColTot.GROUP, 1
    );

    service.polyfunctionStakePresetPlayerObs.subscribe(result => {
      expect(result).toEqual(expectedPolyfunctionStakePresetPlayer);
    });

    service.settingStakePresetPlayer(3);
    expect(service.polyfunctionStakePresetPlayer).toEqual(expectedPolyfunctionStakePresetPlayer);
  });

  it('should setting the default stake for Player for Color sport', () => {
    productService.product =  cloneData(mockProduct);
    productService.product.layoutProducts.type = LAYOUT_TYPE.COLOURS;
    appSetting.defaultAmount.PresetOne = null;

    const expectedPolyfunctionStakePresetPlayer = new PolyfunctionStakePresetPlayer(
      TypeBetSlipColTot.GROUP, 1
    );

    service.polyfunctionStakePresetPlayerObs.subscribe(result => {
      expect(result).toEqual(expectedPolyfunctionStakePresetPlayer);
    });

    service.settingStakePresetPlayer(3);
    expect(service.polyfunctionStakePresetPlayer).toEqual(expectedPolyfunctionStakePresetPlayer);
  });

  it('should setting the default stake for Player for Soccer sport', () => {
    productService.product =  cloneData(mockProduct);
    productService.product.layoutProducts.type = LAYOUT_TYPE.SOCCER;
    appSetting.defaultAmount.PresetOne = null;

    const expectedPolyfunctionStakePresetPlayer = new PolyfunctionStakePresetPlayer(
      TypeBetSlipColTot.COL, 1
    );

    service.polyfunctionStakePresetPlayerObs.subscribe(result => {
      expect(result).toEqual(expectedPolyfunctionStakePresetPlayer);
    });

    service.settingStakePresetPlayer(3);
    expect(service.polyfunctionStakePresetPlayer).toEqual(expectedPolyfunctionStakePresetPlayer);
  });

  it('should turn on Tot/Col button', () => {
    const betTotColSelected: TypeBetSlipColTot = TypeBetSlipColTot.TOT;

    productService.polyfunctionalAreaObservable
    .pipe( skip(1) )
    .subscribe(result => {
      expect(result).toEqual(service.polyfunctionalArea);
    });

    service.polyfunctionStakePresetPlayerObs
    .pipe( skip(1) )
    .subscribe(result => {
      expect(result).toEqual(service.polyfunctionStakePresetPlayer);
    });

    service.btnTotColSelection(betTotColSelected);

    expect(service.polyfunctionalArea.typeSlipCol).toEqual(betTotColSelected);
    expect(service.polyfunctionStakePresetPlayer.typeSlipCol).toEqual(betTotColSelected);
  });

  it('should update polyfunctional area amount with Typing by keyboard', () => {
    service.polyfunctionStakePresetPlayer.hasDecimalSeparator = false;
    service.polyfunctionStakePresetPlayer.firstTap = false;
    service.polyfunctionStakePresetPlayer.typingType = TYPINGTYPE.BY_KEYBOARD;

    const amount: string = '5';
    const typingType: TYPINGTYPE = TYPINGTYPE.BY_KEYBOARD;
    const tempAmount = service.polyfunctionStakePresetPlayer.amount + amount;

    const result: number = service.returnTempNumberToPolyfuncArea(amount, typingType);
    expect(service.polyfunctionStakePresetPlayer.amountStr).toEqual(tempAmount.toString());
    expect(result).toEqual(parseFloat(tempAmount.toString()));
  });

  it('should update polyfunctional area amount with typing by preset', () => {
    service.polyfunctionStakePresetPlayer.amountStr = '1.21';
    service.polyfunctionStakePresetPlayer.hasDecimalSeparator = true;
    service.polyfunctionStakePresetPlayer.firstTap = false;
    service.polyfunctionStakePresetPlayer.typingType = TYPINGTYPE.BY_PRESET;

    const amount: string = '5';
    const typingType: TYPINGTYPE = TYPINGTYPE.BY_PRESET;
    const tempAmount = Number(service.polyfunctionStakePresetPlayer.amountStr) + Number(amount);

    const result: number = service.returnTempNumberToPolyfuncArea(amount, typingType);

    expect(service.polyfunctionStakePresetPlayer.amountStr).toEqual(tempAmount.toString());
    expect(result).toEqual(parseFloat(tempAmount.toString()));
    expect(service.polyfunctionStakePresetPlayer.disableInputCalculator).toBeTrue();
  });

  it('should update polyfunctional area amount when user press "0"', () => {
    service.polyfunctionStakePresetPlayer.typingType = TYPINGTYPE.BY_KEYBOARD;

    const amount: string = '0';
    const typingType: TYPINGTYPE = TYPINGTYPE.BY_PRESET;
    const tempAmount = Number(service.polyfunctionStakePresetPlayer.amount) * 0;

    const result: number = service.returnTempNumberToPolyfuncArea(amount, typingType);
    expect(service.polyfunctionStakePresetPlayer.amountStr).toEqual(tempAmount.toString());
    expect(result).toEqual(parseFloat(tempAmount.toString()));
  });

  it('should update polyfunctional area amount when user press "00"', () => {
    service.polyfunctionStakePresetPlayer.typingType = TYPINGTYPE.BY_KEYBOARD;

    const amount: string = '00';
    const typingType: TYPINGTYPE = TYPINGTYPE.BY_PRESET;
    const tempAmount = Number(service.polyfunctionStakePresetPlayer.amount) * 100;

    const result: number = service.returnTempNumberToPolyfuncArea(amount, typingType);
    expect(service.polyfunctionStakePresetPlayer.amountStr).toEqual(tempAmount.toString());
    expect(result).toEqual(parseFloat(tempAmount.toString()));
  });

  it('should update polyfunctional area amount when user press "000"', () => {
    service.polyfunctionStakePresetPlayer.typingType = TYPINGTYPE.BY_KEYBOARD;

    const amount: string = '000';
    const typingType: TYPINGTYPE = TYPINGTYPE.BY_PRESET;
    const tempAmount = Number(service.polyfunctionStakePresetPlayer.amount) * 1000;

    const result: number = service.returnTempNumberToPolyfuncArea(amount, typingType);
    expect(service.polyfunctionStakePresetPlayer.amountStr).toEqual(tempAmount.toString());
    expect(result).toEqual(parseFloat(tempAmount.toString()));
  });

  it('should set amount to odd', () => {
    const amount: number = 2;
    const oddStake: OddsStakeEdit = cloneData(mockOddStakeEdit);

    oddStake.tempStakeStr = '0';
    oddStake.tempStake = 0;
    const tempAmount: string = amount.toString();

    service.setAmountToOdd(amount, oddStake);

    expect(oddStake.tempStakeStr).toEqual(tempAmount);
    expect(oddStake.tempStake).toEqual(parseFloat(tempAmount.toString()));
  });

  it('should update odd amount', () => {
    const amount: number = 2;
    const oddStake: OddsStakeEdit = cloneData(mockOddStakeEdit);
    const tempAmount: string = oddStake.tempStakeStr + amount.toString();

    service.setAmountToOdd(amount, oddStake);

    expect(oddStake.tempStakeStr).toEqual(tempAmount);
    expect(oddStake.tempStake).toEqual(parseFloat(tempAmount.toString()));
  });

  it('should set decimal to odd stake', () => {
    couponService.oddStakeEdit = cloneData(mockOddStakeEdit);

    const expectedTempStakeStr = couponService.oddStakeEdit.tempStakeStr + '.';
    service.setDecimal();

    expect(couponService.oddStakeEdit.tempStakeStr).toEqual(expectedTempStakeStr);
    expect(couponService.oddStakeEdit.hasDecimalSeparator).toBeTrue();
  });

  it('should set decimal to polyfunction stake', () => {
    couponService.oddStakeEdit = null;
    service.polyfunctionStakePresetPlayer.hasDecimalSeparator = false;

    const expectedAmountStakeStr = service.polyfunctionStakePresetPlayer.amountStr + '.';
    service.setDecimal();

    expect(service.polyfunctionStakePresetPlayer.amountStr).toEqual(expectedAmountStakeStr);
    expect(service.polyfunctionStakePresetPlayer.hasDecimalSeparator).toBeTrue();
  });

  it('should assign stake when odds amount is bigger that 0 ', () => {
    service.polyfunctionalArea = cloneData(mockPolyfunctionalArea);
    service.polyfunctionStakePresetPlayer.isPreset = false;

    productService.product = cloneData(mockProduct);
    productService.product.typeCoupon.acceptMultiStake = true;

    productService.polyfunctionalAreaObservable
    .pipe(skip(1))
    .subscribe(result => {
      expect(result).toEqual(service.polyfunctionalArea);
    });

    spyOn(service, 'settingStakePresetPlayer');
    service.assignStake();

    expect(service.polyfunctionalArea.amount).toEqual(service.polyfunctionStakePresetPlayer.amount);
    expect(service.settingStakePresetPlayer).toHaveBeenCalled();
  });

  it('should assign stake when odds amount is equal 0, TypeBetSlipColTot is Col and multistake is accepted', () => {
    service.polyfunctionalArea = cloneData(mockPolyfunctionalArea);
    service.polyfunctionalArea.odds = [];
    service.polyfunctionStakePresetPlayer.typeSlipCol = TypeBetSlipColTot.COL;

    couponService.coupon = cloneData(mockCoupon);
    productService.product = cloneData(mockProduct);
    productService.product.typeCoupon.acceptMultiStake = true;

    const amountTemp: PolyfunctionalStakeCoupon = {
      columnAmount: service.polyfunctionStakePresetPlayer.amount,
      columns: couponService.coupon.Odds.length,
      digitAmount: service.polyfunctionStakePresetPlayer.amount,
      hasDecimalSeparator: false,
      isEnabled: true,
      totalAmount: service.polyfunctionStakePresetPlayer.amount * couponService.coupon.Odds.length,
      typeSlipCol: TypeBetSlipColTot.COL
    };

    productService.polyfunctionalStakeCouponObs
    .pipe(skip(1))
    .subscribe(result => {
      expect(result).toEqual(amountTemp);
    });

    spyOn(service, 'settingStakePresetPlayer');
    service.assignStake();

    expect(service.polyfunctionStakePresetPlayer.isPreset).toBeFalse();
    expect(service.settingStakePresetPlayer).toHaveBeenCalled();
  });

  it('should assign stake when odds amount is equal 0, TypeBetSlipColTot is Tot and multistake is not accepted', () => {
    service.polyfunctionalArea = cloneData(mockPolyfunctionalArea);
    service.polyfunctionalArea.odds = [];
    service.polyfunctionStakePresetPlayer.typeSlipCol = TypeBetSlipColTot.TOT;

    couponService.coupon = cloneData(mockCoupon);
    productService.product = cloneData(mockProduct);
    productService.product.typeCoupon.acceptMultiStake = true;

    const amountTemp: PolyfunctionalStakeCoupon = {
      columnAmount: service.polyfunctionStakePresetPlayer.amount / couponService.coupon.Odds.length,
      columns: couponService.coupon.Odds.length,
      digitAmount: service.polyfunctionStakePresetPlayer.amount,
      hasDecimalSeparator: false,
      isEnabled: true,
      totalAmount: service.polyfunctionStakePresetPlayer.amount,
      typeSlipCol: TypeBetSlipColTot.TOT
    };

    productService.polyfunctionalStakeCouponObs
    .pipe(skip(1))
    .subscribe(result => {
      expect(result).toEqual(amountTemp);
    });

    spyOn(service, 'settingStakePresetPlayer');
    service.assignStake();

    expect(service.polyfunctionStakePresetPlayer.isPreset).toBeFalse();
    expect(service.settingStakePresetPlayer).toHaveBeenCalled();
  });

  it('should assign stake when odds amount is equal 0, TypeBetSlipColTot is Tot and multistake is not accepted', () => {
    service.polyfunctionalArea = cloneData(mockPolyfunctionalArea);
    service.polyfunctionalArea.odds = [];
    service.polyfunctionStakePresetPlayer.typeSlipCol = TypeBetSlipColTot.COL;

    couponService.coupon = cloneData(mockCoupon);
    couponService.oddStakeEdit = null;

    productService.product = cloneData(mockProduct);
    productService.product.typeCoupon.acceptMultiStake = false;

    let groupNumberCombinations = 0;
    couponService.coupon.Groupings.filter(group => group.Selected).forEach(group => {
      groupNumberCombinations += group.Combinations;
    });

    const amountTemp: PolyfunctionalStakeCoupon = {
      columnAmount: service.polyfunctionStakePresetPlayer.amount,
      columns: groupNumberCombinations,
      digitAmount: service.polyfunctionStakePresetPlayer.amount,
      hasDecimalSeparator: false,
      isEnabled: true,
      totalAmount: service.polyfunctionStakePresetPlayer.amount * groupNumberCombinations,
      typeSlipCol: TypeBetSlipColTot.COL
    };

    productService.polyfunctionalStakeCouponObs
    .pipe(skip(1))
    .subscribe(result => {
      expect(result).toEqual(amountTemp);
    });

    spyOn(service, 'settingStakePresetPlayer');
    service.assignStake();

    expect(service.polyfunctionStakePresetPlayer.isPreset).toBeFalse();
    expect(service.settingStakePresetPlayer).toHaveBeenCalled();
  });

  it('should assign stake when odds amount is equal 0, TypeBetSlipColTot is Tot and multistake is not accepted', () => {
    service.polyfunctionalArea = cloneData(mockPolyfunctionalArea);
    service.polyfunctionalArea.odds = [];
    service.polyfunctionStakePresetPlayer.typeSlipCol = TypeBetSlipColTot.TOT;

    couponService.coupon = cloneData(mockCoupon);
    couponService.oddStakeEdit = null;

    productService.product = cloneData(mockProduct);
    productService.product.typeCoupon.acceptMultiStake = false;

    let groupNumberCombinations = 0;
    couponService.coupon.Groupings.filter(group => group.Selected).forEach(group => {
      groupNumberCombinations += group.Combinations;
    });

    const amountTemp: PolyfunctionalStakeCoupon = {
      columnAmount: service.polyfunctionStakePresetPlayer.amount / groupNumberCombinations,
      columns: groupNumberCombinations,
      digitAmount: service.polyfunctionStakePresetPlayer.amount,
      hasDecimalSeparator: false,
      isEnabled: true,
      totalAmount: service.polyfunctionStakePresetPlayer.amount,
      typeSlipCol: TypeBetSlipColTot.TOT
    };

    productService.polyfunctionalStakeCouponObs
    .pipe(skip(1))
    .subscribe(result => {
      expect(result).toEqual(amountTemp);
    });

    spyOn(service, 'settingStakePresetPlayer');
    service.assignStake();

    expect(service.polyfunctionStakePresetPlayer.isPreset).toBeFalse();
    expect(service.settingStakePresetPlayer).toHaveBeenCalled();
  });

  it('should assign stake when odds amount is equal 0, TypeBetSlipColTot is Tot, multistake is not accepted and oddStake has grouping', () => {
    service.polyfunctionalArea = cloneData(mockPolyfunctionalArea);
    service.polyfunctionalArea.odds = [];
    service.polyfunctionStakePresetPlayer.typeSlipCol = TypeBetSlipColTot.COL;

    couponService.coupon = cloneData(mockCoupon);
    couponService.oddStakeEdit = cloneData(mockOddStakeEdit);
    couponService.oddStakeEdit.grouping = cloneData(mockCoupon.Groupings[0]);

    productService.product = cloneData(mockProduct);
    productService.product.typeCoupon.acceptMultiStake = false;

    let groupNumberCombinations = 0;
    couponService.coupon.Groupings.filter(group => group.Selected).forEach(group => {
      groupNumberCombinations += group.Combinations;
    });

    const amountTemp: PolyfunctionalStakeCoupon = {
      columnAmount: 0,
      columns: groupNumberCombinations,
      digitAmount: couponService.oddStakeEdit.tempStake,
      hasDecimalSeparator: false,
      isEnabled: true,
      totalAmount: service.polyfunctionStakePresetPlayer.amount,
      typeSlipCol: TypeBetSlipColTot.COL
    };

    productService.polyfunctionalStakeCouponObs
    .pipe(skip(1))
    .subscribe(result => {
      expect(result).toEqual(amountTemp);
    });

    spyOn(service, 'settingStakePresetPlayer');
    service.assignStake();

    expect(service.polyfunctionStakePresetPlayer.isPreset).toBeFalse();
    expect(couponService.oddStakeEdit.grouping.Stake).toEqual(couponService.oddStakeEdit.tempStake);
    expect(service.settingStakePresetPlayer).toHaveBeenCalled();
  });

  it('should assign stake when odds amount is equal 0, TypeBetSlipColTot is Tot, multistake is not accepted and oddStake has grouping', () => {
    service.polyfunctionalArea = cloneData(mockPolyfunctionalArea);
    service.polyfunctionalArea.odds = [];
    service.polyfunctionStakePresetPlayer.typeSlipCol = TypeBetSlipColTot.TOT;

    couponService.coupon = cloneData(mockCoupon);
    couponService.oddStakeEdit = cloneData(mockOddStakeEdit);
    couponService.oddStakeEdit.grouping = cloneData(mockCoupon.Groupings[0]);

    productService.product = cloneData(mockProduct);
    productService.product.typeCoupon.acceptMultiStake = false;

    let groupNumberCombinations = 0;
    couponService.coupon.Groupings.filter(group => group.Selected).forEach(group => {
      groupNumberCombinations += group.Combinations;
    });

    const amountTemp: PolyfunctionalStakeCoupon = {
      columnAmount: service.polyfunctionStakePresetPlayer.amount / groupNumberCombinations,
      columns: groupNumberCombinations,
      digitAmount: service.polyfunctionStakePresetPlayer.amount,
      hasDecimalSeparator: false,
      isEnabled: true,
      totalAmount: service.polyfunctionStakePresetPlayer.amount,
      typeSlipCol: TypeBetSlipColTot.TOT
    };

    const groupingStake: number = couponService.oddStakeEdit.tempStake / couponService.oddStakeEdit.grouping.Combinations;

    productService.polyfunctionalStakeCouponObs
    .pipe(skip(1))
    .subscribe(result => {
      expect(result).toEqual(amountTemp);
    });

    spyOn(service, 'settingStakePresetPlayer');
    service.assignStake();

    expect(service.polyfunctionStakePresetPlayer.isPreset).toBeFalse();
    expect(couponService.oddStakeEdit.grouping.Stake).toEqual(groupingStake);
    expect(service.settingStakePresetPlayer).toHaveBeenCalled();
  });

});
