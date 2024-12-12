import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BehaviorSubject, Observable, of, Subject, timer } from 'rxjs';

import { ElysApiService, PlaySource, VirtualEventCountDownRequest } from '@elys/elys-api';
import { ElysFeedsService } from '@elys/elys-feeds';

import { MainService } from './main.service';
import { ProductsService } from '../products.service';
import { BtncalcService } from 'src/app/component/btncalc/btncalc.service';
import { CouponService } from 'src/app/component/coupon/coupon.service';
import { DestroyCouponService } from 'src/app/component/coupon/confirm-destroy-coupon/destroy-coupon.service';
import { UserService } from 'src/app/services/user.service';
import { 
  BetOdd, 
  CouponConfirmDelete, 
  PolyfunctionalArea, 
  PolyfunctionalStakeCoupon, 
  PolyfunctionStakePresetPlayer } from '../products.model';
import { 
  mockDataGenerateOdds,
  mockDataGenerateOddsRow,
  mockDataMarketIdentifier,
  mockDataTypeSelection,
  mockEventDetail, 
  mockEventTime, 
  mockPlacingEvent, 
  mockPlayerList, 
  mockPlayerListCleared, 
  mockPolyfunctionalArea, 
  mockPolyfunctionalStakeCoupon, 
  mockSmartCode, 
  mockVirtualGetRankByEventResponse } from 'src/app/mock/mine.mock';
import { Products } from 'src/environments/environment.models';
import { mockProduct, mockProductSoccer } from 'src/app/mock/product.mock';
import { ElysApiServiceStub } from 'src/app/mock/stubs/elys-api.stub';
import { EventDetail, EventTime, PlacingEvent, Smartcode, TypeBetSlipColTot, VirtualBetSelectionExtended } from './main.models';
import { mockUserId } from 'src/app/mock/user.mock';
import { ColourGameId } from './colour-game.enum';
import { ResultsService } from './results/results.service';
import { Results } from './results/results';
import { 
  mockFirstDurationSoccer, 
  mockFirstEvDuration, 
  mockFirstEvId, 
  mockFirstEvIdSoccer, 
  mockTournamentDetails, 
  mockTsMft, 
  mockTsMftSoccer, 
  mockVirtualBetTournamentExtended, 
  mockVirtualProgramTreeBySportResponseSoccer } from 'src/app/mock/sports.mock';
import { mockFirstSlsId, mockVirtualBetEvent } from 'src/app/mock/virtual-bet-event.mock';
import { InternalCoupon } from 'src/app/component/coupon/coupon.model';
import { mockCoupon } from 'src/app/mock/coupon.mock';
import { MatDialogRefStub } from 'src/app/mock/stubs/mat-dialog.stub';
import { cloneData } from 'src/app/mock/helpers/clone-mock.helper';

class ProductServiceStub {
  productNameSelectedSubscribe: Subject<string>;
  productNameSelectedObserve: Observable<string>;

  playableBoardResetSubject: Subject<boolean>;
  playableBoardResetObserve: Observable<boolean>;

  polyfunctionalAreaSubject: BehaviorSubject<PolyfunctionalArea>;
  polyfunctionalAreaObservable: Observable<PolyfunctionalArea>;

  polyfunctionalStakeCouponSubject: Subject<PolyfunctionalStakeCoupon>;
  polyfunctionalStakeCouponObs: Observable<PolyfunctionalStakeCoupon>;

  product: Products;

  constructor(){
    this.productNameSelectedSubscribe = new Subject<string>();
    this.productNameSelectedObserve = this.productNameSelectedSubscribe.asObservable();

    this.playableBoardResetSubject = new Subject<boolean>();
    this.playableBoardResetObserve = this.playableBoardResetSubject.asObservable();

    this.polyfunctionalAreaSubject = new BehaviorSubject<PolyfunctionalArea>(new PolyfunctionalArea());
    this.polyfunctionalAreaObservable = this.polyfunctionalAreaSubject.asObservable();

    this.polyfunctionalStakeCouponSubject = new Subject<PolyfunctionalStakeCoupon>();
    this.polyfunctionalStakeCouponObs = this.polyfunctionalStakeCouponSubject.asObservable();
  }

  closeProductDialog(): void {};
  changeProduct(codeProduct: string): void {}
}

class BtncalcServiceStub {
  get polyfunctionStakePresetPlayer(): PolyfunctionStakePresetPlayer {
    return new PolyfunctionStakePresetPlayer(0, 1)
  };
}

class CouponServiceStub {
  productHasCoupon: CouponConfirmDelete;
  get coupon(): InternalCoupon {return null};
  constructor(){
    this.productHasCoupon = { checked: false };
  }
  resetCoupon(): void {};
  checkIfCouponIsReadyToPlace(): boolean {
    return false
  };
  checkHasCoupon(): void {
    this.productHasCoupon.checked = true;
  }
}

class DestroyCouponServiceStub {
  openDestroyCouponDialog = jasmine.createSpy('openDestroyCouponDialog');
  dialogRef = new MatDialogRefStub();
}

class ElysFeedsServiceStub {}

class ResultsServiceStub {
  resultsUtils = new Results();
  getLastResult() {};
}

class UserServiceStub {
  getUserId(): number {
    return mockUserId
  }
  get isUserLogged(): boolean {
    return true
  }
}

describe('MainService', () => {
  let service: MainService;
  let spyCreatePlayerList: jasmine.Spy<() => void>;
  let productService: ProductServiceStub;
  let couponService: CouponServiceStub;
  let userService: UserServiceStub;
  let resultService: ResultsServiceStub;
  let elysApiService: ElysApiServiceStub;
  let btncalcService: BtncalcServiceStub;
  let destroyCouponService: DestroyCouponServiceStub;
  beforeEach(() => {
    productService = new ProductServiceStub();
    couponService = new CouponServiceStub();
    userService = new UserServiceStub();
    resultService = new ResultsServiceStub();
    elysApiService = new ElysApiServiceStub();
    btncalcService = new BtncalcServiceStub();
    destroyCouponService = new DestroyCouponServiceStub();
    TestBed.configureTestingModule({
        imports: [],
        providers: [
          MainService,
          { provide: ProductsService, useValue: productService},
          { provide: CouponService, useValue: couponService},
          { provide: UserService, useValue: userService},
          { provide: ResultsService, useValue: resultService},
          { provide: ElysApiService, useValue: elysApiService},
          { provide: ElysFeedsService, useClass: ElysFeedsServiceStub},
          { provide: BtncalcService, useValue: btncalcService},
          { provide: DestroyCouponService, useValue: destroyCouponService},
        ],
    });
    spyCreatePlayerList = spyOn(MainService.prototype, 'createPlayerList').and.callThrough();
    service = TestBed.inject(MainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be call createPlayerList and set toResetAllSelections as true', () => {
    expect(spyCreatePlayerList).toHaveBeenCalled();
    expect(service.toResetAllSelections).toBeTrue();
    expect(JSON.stringify(service.playersList)).toEqual(JSON.stringify(mockPlayerListCleared))
  });

  it('should be call initEvents', () => {
    spyOn(service, 'initEvents');

    couponService.productHasCoupon.checked = false;
    productService.productNameSelectedSubscribe.next();

    expect(service.initEvents).toHaveBeenCalled();
  });

  it('should be set eventDetails, remainingTime and call resetPlayEvent and resetCoupon', async () => {
    const mockEventTime: EventTime = {
      minute: 1,
      second: 3,
    }
    const mockEventIndex = 0;

    productService.product = mockProduct;

    spyOn(service, 'resetPlayEvent');
    spyOn(couponService, 'resetCoupon');
    const spyremainingEventTime = spyOn(service, 'remainingEventTime').and.returnValue(Promise.resolve(mockEventTime));

    service.eventDetails = cloneData(mockEventDetail);

    service.currentEventSubscribe.next(mockEventIndex);

    await spyremainingEventTime.calls.mostRecent().returnValue.then(() => {
      expect(service.eventDetails.eventTime).toEqual(mockEventTime);
      expect(service.remainingTime.minute).toEqual(mockEventTime.minute);
      expect(service.remainingTime.second).toEqual(mockEventTime.second);
    });
    
    expect(service.eventDetails.currentEvent).toEqual(mockEventIndex);
    expect(service.resetPlayEvent).toHaveBeenCalled();
    expect(couponService.resetCoupon).toHaveBeenCalled();
  });

  it('should be set toResetAllSelections as true and call resumeCountDown and resetPlayEvent', fakeAsync(() => {
    spyOn(service, 'resumeCountDown');
    spyOn(service, 'resetPlayEvent');

    service.toResetAllSelections = false;

    productService.playableBoardResetSubject.next(true);
    
    expect(service.toResetAllSelections).toBeTrue();
    expect(service.resumeCountDown).toHaveBeenCalled();
    tick(500);
    expect(service.resetPlayEvent).toHaveBeenCalled();
  }));

  it('resumeCountDown() should be call currentAndSelectedEventTime and call getTime every 1 sec', fakeAsync(() => {
    spyOn(service, 'currentAndSelectedEventTime');
    spyOn(service, 'getTime');

    service.resumeCountDown();

    expect(service.currentAndSelectedEventTime).toHaveBeenCalled();
    tick(1000);
    expect(service.getTime).toHaveBeenCalled();
    service.countdownSub.unsubscribe();
  }));

  it('destroy() should be unsubscribed from countdownSub', () => {
    spyOn(service, 'getTime');

    service.resumeCountDown();
    spyOn(service.countdownSub, 'unsubscribe').and.callThrough();

    service.destroy();

    expect(service.countdownSub.unsubscribe).toHaveBeenCalled();
    expect(service.initCurrentEvent).toBeTrue();
  });

  it('initEvents() should be call loadEvents and set initCurrentEvent, selectedColourGameId, eventDetails', () => {
    spyOn(service, 'loadEvents');

    productService.product = mockProduct;

    service.initEvents();

    expect(service.loadEvents).toHaveBeenCalled();
    expect(service.initCurrentEvent).toBeTrue();
    expect(service.selectedColourGameId).toEqual(ColourGameId.bet49);
    expect(service.eventDetails).toEqual(new EventDetail(mockProduct.layoutProducts.nextEventItems))
  });

  it('getTime() should be stop the countdown and call loadEvents (case 1)', () => {
    spyOn(service, 'loadEvents');
    service.countdownSub = timer(0, 1000).subscribe();
    spyOn(service.countdownSub, 'unsubscribe').and.callThrough();

    spyOnProperty(userService, 'isUserLogged').and.returnValue(true);
    service.remainingTime.second = 0;
    service.remainingTime.minute = 0;

    service.getTime();
    expect(service.loadEvents).toHaveBeenCalled();
    expect(service.countdownSub.unsubscribe).toHaveBeenCalled();
  });

  it('getTime() should be stop the countdown and call loadEvents (case 2)', () => {
    spyOn(service, 'loadEvents');
    service.countdownSub = timer(0, 1000).subscribe();
    spyOn(service.countdownSub, 'unsubscribe').and.callThrough();

    spyOnProperty(userService, 'isUserLogged').and.returnValue(false);
    service.remainingTime.second = 1;
    service.remainingTime.minute = 0;

    service.getTime();
    expect(service.loadEvents).toHaveBeenCalled();
    expect(service.countdownSub.unsubscribe).toHaveBeenCalled();
  });

  it('getTime() should be stop the countdown and call loadEvents (case 3)', () => {
    spyOn(service, 'loadEvents');
    service.countdownSub = timer(0, 1000).subscribe();
    spyOn(service.countdownSub, 'unsubscribe').and.callThrough();

    spyOnProperty(userService, 'isUserLogged').and.returnValue(true);
    service.remainingTime.second = -1;
    service.remainingTime.minute = 0;

    service.getTime();
    expect(service.loadEvents).toHaveBeenCalled();
    expect(service.countdownSub.unsubscribe).toHaveBeenCalled();
  });

  it('getTime() should be set second=59 and decrement minute by 1', () => {
    const mockMinute = 3;
    const mockSecond = 59;

    spyOn(service, 'loadEvents');
    service.countdownSub = timer(0, 1000).subscribe();
    service.eventDetails = new EventDetail(mockProduct.layoutProducts.nextEventItems);
    service.remainingTime.second = 0;
    service.remainingTime.minute = mockMinute;
    service.eventDetails.eventTime.minute = mockMinute;

    service.getTime();

    expect(service.remainingTime.second).toBe(mockSecond);
    expect(service.remainingTime.minute).toBe(mockMinute - 1);
    expect(service.eventDetails.eventTime.second).toBe(mockSecond);
    expect(service.eventDetails.eventTime.minute).toBe(mockMinute - 1);

    expect(resultService.resultsUtils.countDown).toEqual(service.remainingTime);

    service.countdownSub.unsubscribe();
  });

  it('getTime() should be decrement second by 1', () => {
    const mockMinute = 3;
    const mockSecond = 15;

    spyOn(service, 'loadEvents');
    service.countdownSub = timer(0, 1000).subscribe();
    service.eventDetails = new EventDetail(mockProduct.layoutProducts.nextEventItems);
    service.remainingTime.second = mockSecond;
    service.remainingTime.minute = mockMinute;
    service.eventDetails.eventTime.minute = mockMinute;

    service.getTime();

    expect(service.remainingTime.second).toBe(mockSecond - 1);
    expect(service.remainingTime.minute).toBe(mockMinute);
    expect(service.eventDetails.eventTime.second).toBe(mockSecond - 1);
    expect(service.eventDetails.eventTime.minute).toBe(mockMinute);
    
    expect(resultService.resultsUtils.countDown).toEqual(service.remainingTime);
    expect(service.placingEvent.timeBlocked).toBeFalse();

    service.countdownSub.unsubscribe();
  });

  it('getTime() should be call closeProductDialog', () => {
    const mockMinute = 0;
    const mockSecond = 5;

    spyOn(service, 'loadEvents');
    spyOn(productService, 'closeProductDialog');
    service.countdownSub = timer(0, 1000).subscribe();
    service.eventDetails = new EventDetail(mockProduct.layoutProducts.nextEventItems);
    service.remainingTime.second = mockSecond;
    service.remainingTime.minute = mockMinute;
    service.eventDetails.eventTime.minute = mockMinute;
    service.eventDetails.eventTime.second = mockSecond;

    service.getTime();
    
    expect(resultService.resultsUtils.countDown).toEqual(service.remainingTime);
    expect(service.placingEvent.timeBlocked).toBeTrue();
    expect(productService.closeProductDialog).toHaveBeenCalled();

    service.countdownSub.unsubscribe();
  });

  it('loadEvents() should be call loadEventsFromApi, getLastResult, getTime', fakeAsync(() => {
    spyOn(resultService, 'getLastResult');

    spyOn(service, 'loadEventsFromApi').and.returnValue(Promise.resolve());
    spyOn(service, 'getTime');
    service.initCurrentEvent = true;

    service.loadEvents();

    expect(service.loadEventsFromApi).toHaveBeenCalled();
    tick(1000);
    expect(resultService.getLastResult).toHaveBeenCalled();
    expect(service.getTime).toHaveBeenCalled();

    service.countdownSub.unsubscribe();
  }));

  it('loadEvents() should be call loadEventsFromApi, getLastResult, slideToNextEvent, currentAndSelectedEventTime, getTime', fakeAsync(() => {
    spyOn(resultService, 'getLastResult');
    spyOn(service, 'loadEventsFromApi').and.callThrough();
    spyOn(service, 'getTime');
    spyOn(service, 'currentAndSelectedEventTime');

    service.initCurrentEvent = false;
    service.eventDetails = new EventDetail(mockProduct.layoutProducts.nextEventItems);
    productService.product = mockProduct;

    service.loadEvents();

    expect(service.loadEventsFromApi).toHaveBeenCalledWith(service.eventDetails.events[0]);
    tick(1000);
    expect(resultService.getLastResult).toHaveBeenCalled();
    expect(service.getTime).toHaveBeenCalled();
    expect(service.currentAndSelectedEventTime).toHaveBeenCalled();

    service.countdownSub.unsubscribe();
  }));

  it('loadEventsFromApi() should be load and set events', async () => {
    const mockRequest = {
      SportIds: mockProduct.sportId.toString(),
      CategoryTypes: mockProduct.codeProduct,
      Source: PlaySource.VDeskWeb,
      Item: mockUserId
    };
    const mockEvents = [ 
      {
        number: 21347600, 
        label: 'Race n. 288', 
        date: new Date('2022-08-24T10:47:00+02:00')
      },
      {
        number: 21254748, 
        label: 'Race n. 234', 
        date: new Date('2022-08-18T09:53:00+02:00')
      }, 
      {
        number: 21254750, 
        label: 'Race n. 236', 
        date: new Date('2022-08-18T09:55:00+02:00')
      }, 
      {
        number: 21254752, 
        label: 'Race n. 238', 
        date: new Date('2022-08-18T09:57:00+02:00')
      }, 
      {
        number: 21254754, 
        label: 'Race n. 240', 
        date: new Date('2022-08-18T09:59:00+02:00')
      }
    ]

    spyOn(service, 'getTime');
    spyOn(service, 'currentAndSelectedEventTime');
    spyOn(elysApiService.virtual, 'getVirtualTreeV2').and.callThrough();

    service.initCurrentEvent = true;
    service.eventDetails = new EventDetail(mockProduct.layoutProducts.nextEventItems);
    productService.product = mockProduct;

    await service.loadEventsFromApi();

    expect(elysApiService.virtual.getVirtualTreeV2).toHaveBeenCalledWith(mockRequest);
    expect(service.currentAndSelectedEventTime).toHaveBeenCalledWith(false);
    expect(productService.product.layoutProducts.multiFeedType).toBe(mockTsMft);
    expect(JSON.stringify(service.eventDetails.events)).toEqual(JSON.stringify(mockEvents));
    expect(resultService.resultsUtils.nextEventNumber).toBe(mockFirstEvId);
    expect(resultService.resultsUtils.nextEventDuration).toBe(mockFirstEvDuration);
  });

  it('loadEventsFromApi() should be load and set events for soccer', async () => {
    const mockRequest = {
      SportIds: '1',
      CategoryTypes: mockProductSoccer.codeProduct,
      Source: PlaySource.VDeskWeb,
      Item: mockUserId
    };
    const mockEvents = [
      {
        number: 21270764, 
        label: 'Week #36', 
        date: new Date('2022-08-19T07:46:00.000Z')
      }
    ]

    spyOn(service, 'getTime');
    spyOn(service, 'currentAndSelectedEventTime');
    spyOn(elysApiService.virtual, 'getVirtualTreeV2').and.returnValue(Promise.resolve(mockVirtualProgramTreeBySportResponseSoccer));

    service.initCurrentEvent = true;
    service.eventDetails = new EventDetail(mockProductSoccer.layoutProducts.nextEventItems);
    productService.product = mockProductSoccer;

    await service.loadEventsFromApi();

    expect(elysApiService.virtual.getVirtualTreeV2).toHaveBeenCalledWith(mockRequest);
    expect(service.currentAndSelectedEventTime).toHaveBeenCalledWith(false);

    expect(productService.product.layoutProducts.multiFeedType).toBe(mockTsMftSoccer);
    expect(JSON.stringify(service.eventDetails.events)).toEqual(JSON.stringify(mockEvents));
    expect(resultService.resultsUtils.nextEventNumber).toBe(mockFirstEvIdSoccer);
    expect(resultService.resultsUtils.nextEventDuration).toBe(mockFirstDurationSoccer);
  });

  it('getRanking() should be get ranking data', async () => {
    const mockTournamentId = 123;
    spyOn(elysApiService.virtual, 'getRanking').and.callThrough();
    service.currentProductDetails = mockVirtualBetTournamentExtended;
    await service.getRanking(mockTournamentId).then((data) => {
      expect(data).toEqual(mockVirtualGetRankByEventResponse)
    });
    expect(elysApiService.virtual.getRanking).toHaveBeenCalledWith(mockTournamentId)
  });

  it('currentAndSelectedEventTime() should be decrease currentEvent by 1 (case 1)', async () => {
    const mockCurrentEvent = 2;

    const spyRemainingEventTime = spyOn(service, 'remainingEventTime').and.returnValue(Promise.resolve(mockEventTime));
    spyOn(service.currentEventSubscribe, 'next');
    spyOn(service, 'resetPlayEvent');

    service.initCurrentEvent = true; //case 1

    service.eventDetails = cloneData(mockEventDetail);
    service.eventDetails.currentEvent = mockCurrentEvent;
    service.currentAndSelectedEventTime();

    expect(service.eventDetails.currentEvent).toBe(mockCurrentEvent - 1);

    expect(service.initCurrentEvent).toBeFalse();
    expect(service.currentEventSubscribe.next).toHaveBeenCalledWith(0);
    expect(service.resetPlayEvent).toHaveBeenCalled();

    await spyRemainingEventTime.calls.mostRecent().returnValue.then((eventTime) => {
      expect(service.remainingTime).toEqual(eventTime);
    });
  });

  it('currentAndSelectedEventTime() should be decrease currentEvent by 1 (case 2)', async () => {
    const mockCurrentEvent = 2;

    const spyRemainingEventTime = spyOn(service, 'remainingEventTime').and.returnValue(Promise.resolve(mockEventTime));
    spyOn(service.currentEventSubscribe, 'next');

    service.initCurrentEvent = false; //case 2

    service.eventDetails = cloneData(mockEventDetail);
    service.eventDetails.currentEvent = mockCurrentEvent;
    service.currentAndSelectedEventTime();

    expect(service.eventDetails.currentEvent).toBe(mockCurrentEvent - 1);

    expect(service.toResetAllSelections).toBeFalse();
    expect(service.currentEventSubscribe.next).toHaveBeenCalledWith(mockCurrentEvent - 1);

    await spyRemainingEventTime.calls.mostRecent().returnValue.then((eventTime) => {
      expect(service.remainingTime).toEqual(eventTime);
    });
  });

  it('currentAndSelectedEventTime() should be emmit 0 to currentEventSubscribe', () => {
    const mockCurrentEvent = 0;

    spyOn(service.currentEventSubscribe, 'next');

    service.eventDetails = cloneData(mockEventDetail);
    service.eventDetails.currentEvent = mockCurrentEvent;
    service.currentAndSelectedEventTime();

    expect(service.toResetAllSelections).toBeTrue();
    expect(service.currentEventSubscribe.next).toHaveBeenCalledWith(0);
  });

  it('currentAndSelectedEventTime() should be return eventTime', async () => {
    spyOn(elysApiService.virtual, 'getCountdown').and.callThrough();
    const mockEventTime: EventTime = {
      minute: 1,
      second: 40,
    };
    const mockIdEvent = 123;
    const mockRequest: VirtualEventCountDownRequest = {
      SportId: mockProduct.sportId.toString(),
      MatchId: mockIdEvent
    };

    productService.product = mockProduct;

    await service.remainingEventTime(mockIdEvent).then((eventTime) => {
      expect(eventTime.minute).toEqual(mockEventTime.minute);
      expect(eventTime.second).toEqual(mockEventTime.second);
    });

    expect(elysApiService.virtual.getCountdown).toHaveBeenCalledWith(mockRequest);
  });

  it('currentAndSelectedEventTime() should be call changeProduct', async () => {
    spyOn(elysApiService.virtual, 'getCountdown').and.returnValue(Promise.resolve({CountDown: -1}));
    spyOn(productService, 'changeProduct');

    const mockIdEvent = 123;
    const mockRequest: VirtualEventCountDownRequest = {
      SportId: mockProduct.sportId.toString(),
      MatchId: mockIdEvent
    };

    productService.product = mockProduct;

    await service.remainingEventTime(mockIdEvent);

    expect(elysApiService.virtual.getCountdown).toHaveBeenCalledWith(mockRequest);
    expect(productService.changeProduct).toHaveBeenCalledWith(mockProduct.codeProduct);
    expect(service.initCurrentEvent).toBeTrue();
  });

  it('resetPlayEvent() should be create and set new objects (PlacingEvent, Smartcode, PolyfunctionalArea, PolyfunctionalStakeCoupon)', () => {
    spyOn(service, 'clearPlayerListEvents');
    spyOn(productService.polyfunctionalAreaSubject, 'next');
    spyOn(productService.polyfunctionalStakeCouponSubject, 'next');
    service.eventDetails = cloneData(mockEventDetail);
    productService.product = mockProduct;

    service.resetPlayEvent();

    expect(service.clearPlayerListEvents).toHaveBeenCalled();
    expect(JSON.stringify(service.placingEvent)).toBe(JSON.stringify(mockPlacingEvent));
    expect(JSON.stringify(service.smartCode)).toBe(JSON.stringify(mockSmartCode));

    expect(productService.polyfunctionalAreaSubject.next).toHaveBeenCalledOnceWith(mockPolyfunctionalArea);
    expect(productService.polyfunctionalStakeCouponSubject.next).toHaveBeenCalledOnceWith(mockPolyfunctionalStakeCoupon);
  });

  it('clearPlayerListEvents() should be call createPlayerList', () => {
    spyCreatePlayerList.calls.reset();
    service.playersList = null;
    service.clearPlayerListEvents();
    expect(spyCreatePlayerList).toHaveBeenCalled();
  });

  it('clearPlayerListEvents() should be set all actived as false and selectable as true', () => {
    service.playersList = mockPlayerList;
    service.clearPlayerListEvents();
    expect(service.playersList).toEqual(mockPlayerListCleared);
  });

  it('checkIfCouponIsReadyToPlace() should be call couponService.checkIfCouponIsReadyToPlace', () => {
    spyOn(couponService, 'checkIfCouponIsReadyToPlace');
    service.checkIfCouponIsReadyToPlace();
    expect(couponService.checkIfCouponIsReadyToPlace).toHaveBeenCalled()
  });

  it('placingOddByOdd() should be add odd to placingEvent', () => {
    const mockMarketId = 10;
    const mockOdd = {
      id: 585416362,
      nm: '1',
      tp: 1,
      ods: [
        {
          vl: 3.86,
          st: 1
        }
      ]
    };
    const expectedOdd = {
      id: 585416362,
      nm: '1',
      tp: 1,
      ods: [
        {
          vl: 3.86,
          st: 1
        }
      ],
      marketId: mockMarketId
    }
    spyOn(service, 'populatingPolyfunctionAreaByOdds');

    service.placingOddByOdd(mockMarketId, mockOdd);

    expect(service.placingEvent.odds).toEqual([expectedOdd]);

    expect(service.populatingPolyfunctionAreaByOdds).toHaveBeenCalled();
    expect(JSON.stringify(service.smartCode)).toBe(JSON.stringify(mockSmartCode));
  });

  it('placingOddByOdd() should be removed odd from placingEvent', () => {
    const mockMarketId = 10;
    const mockOdd = {
      id: 585416362,
      nm: '1',
      tp: 1,
      ods: [
        {
          vl: 3.86,
          st: 1
        }
      ]
    };
    const expectedOdd = {
      id: 585416362,
      nm: '1',
      tp: 1,
      ods: [
        {
          vl: 3.86,
          st: 1
        }
      ],
      marketId: mockMarketId
    };
    service.placingEvent.odds = [expectedOdd];
    spyOn(service, 'populatingPolyfunctionAreaByOdds');

    service.placingOddByOdd(mockMarketId, mockOdd);

    expect(service.placingEvent.odds).toEqual([]);

    expect(service.populatingPolyfunctionAreaByOdds).toHaveBeenCalled();
    expect(JSON.stringify(service.smartCode)).toBe(JSON.stringify(mockSmartCode));
  });

  it('placingOdd() should be add player to placingEvent', () => {
    const mockPlayer = {
      number: 1,
      selectable: true,
      actived: false,
      position: 1
    };
    const expectedPlayer = {
      number: 1,
      selectable: true,
      actived: true,
      position: 1
    }
    spyOn(service, 'placeOdd');

    service.placingOdd(mockPlayer);

    expect(service.placingEvent.players).toEqual([expectedPlayer]);

    expect(service.placeOdd).toHaveBeenCalled();
  });

  it('placingOdd() should be remove player from placingEvent', () => {
    const mockPlayer = {
      number: 1,
      selectable: true,
      actived: false,
      position: 1
    };
    const expectedPlayer = {
      number: 1,
      selectable: true,
      actived: true,
      position: 1
    }
    spyOn(service, 'placeOdd');
    service.placingEvent.players = [expectedPlayer];

    service.placingOdd(mockPlayer);

    expect(service.placingEvent.players).toEqual([]);

    expect(service.placeOdd).toHaveBeenCalled();
  });

  it('placeOdd() should be call populatingPolyfunctionArea', async () => {
    spyOn(service, 'populatingPolyfunctionArea');
    spyOn(service, 'currentAndSelectedEventTime');

    service.placingEvent.eventNumber = mockFirstEvId;
    service.eventDetails = new EventDetail(mockProduct.layoutProducts.nextEventItems);
    productService.product = mockProduct;

    await service.loadEventsFromApi(); // set cacheEvents

    service.placeOdd();

    expect(JSON.stringify(service.smartCode)).toBe(JSON.stringify(mockSmartCode));
    expect(service.populatingPolyfunctionArea).toHaveBeenCalledWith(mockVirtualBetTournamentExtended.evs.find(ev => ev.id === mockFirstEvId));
  });

  it('typePlacing() should be unset typePlace and set thirdRowDisabled as false', () => {
    const mockTypePlace = 0;

    spyOn(service, 'placeOdd');

    service.placingEvent = cloneData(mockPlacingEvent) as undefined as PlacingEvent;
    service.placingEvent.typePlace = mockTypePlace;

    service.typePlacing(mockTypePlace);

    expect(service.placingEvent.typePlace).not.toBeDefined();
    expect(service.placingEvent.thirdRowDisabled).toBeFalse();
    expect(service.placeOdd).toHaveBeenCalled();
  });

  it('typePlacing() should be set typePlace=0 and set thirdRowDisabled as true', () => {
    const mockTypePlace = 0;

    spyOn(service, 'placeOdd');

    service.placingEvent = cloneData(mockPlacingEvent) as undefined as PlacingEvent;

    service.typePlacing(mockTypePlace);

    expect(service.placingEvent.typePlace).toBe(mockTypePlace);
    expect(service.placingEvent.thirdRowDisabled).toBeTrue();
    expect(service.placeOdd).toHaveBeenCalled();
  });

  it('typePlacing() should be set typePlace=2 and set thirdRowDisabled as false', () => {
    const mockTypePlace = 2;

    spyOn(service, 'placeOdd');

    service.placingEvent = cloneData(mockPlacingEvent) as undefined as PlacingEvent;

    service.typePlacing(mockTypePlace);

    expect(service.placingEvent.typePlace).toBe(mockTypePlace);
    expect(service.placingEvent.thirdRowDisabled).toBeFalse();
    expect(service.placeOdd).toHaveBeenCalled();
  });

  it('populatingPolyfunctionAreaByOdds() should be emmit areaFuncData to productService.polyfunctionalAreaSubject', () => {
    const mockMarketId = 10;
    const mockAmaunt = 1;
    const mockTypeBetSlipColTot = TypeBetSlipColTot.COL;
    const mockOddLable = '1';
    const mockOddVl = 3.86;
    const mockOddId = 585416362;
    const mockOdd = {
      id: mockOddId,
      nm: mockOddLable,
      tp: 1,
      ods: [
        {
          vl: mockOddVl,
          st: mockAmaunt
        }
      ],
      marketId: mockMarketId
    };

    const mockBetOdd = new BetOdd(mockOddLable, mockOddVl, mockAmaunt, mockOddId);

    const expectedAreaFuncData = new PolyfunctionalArea();

    expectedAreaFuncData.activeAssociationCol = false;
    expectedAreaFuncData.activeDistributionTot = false;
    expectedAreaFuncData.selection = 'V';
    expectedAreaFuncData.value = '1';
    expectedAreaFuncData.amount = mockAmaunt;
    expectedAreaFuncData.typeSlipCol = mockTypeBetSlipColTot;
    expectedAreaFuncData.odds = [mockBetOdd];
    expectedAreaFuncData.firstTap = true;

    service.placingEvent.odds = [mockOdd];

    spyOn(productService.polyfunctionalAreaSubject, 'next');
    spyOnProperty(btncalcService, 'polyfunctionStakePresetPlayer')
      .and.returnValue(new PolyfunctionStakePresetPlayer(mockTypeBetSlipColTot, mockAmaunt));

    service.populatingPolyfunctionAreaByOdds();

    expect(productService.polyfunctionalAreaSubject.next).toHaveBeenCalledWith(expectedAreaFuncData)
  });

  it('populatingPolyfunctionArea() should be emmit areaFuncData to productService.polyfunctionalAreaSubject (case 1)', () => {
    const mockAmaunt = 1;
    const mockTypeBetSlipColTot = TypeBetSlipColTot.COL;
    const mockOddLable = 'Samurai';
    const mockOddVl = 3.72;
    const mockOddId = 586983464;

    const mockPlayer = {
      number: 1,
      selectable: true,
      actived: true,
      position: 1
    };

    const mockBetOdd = new BetOdd(mockOddLable, mockOddVl, mockAmaunt, mockOddId);
    const expectedAreaFuncData = new PolyfunctionalArea();

    const smartCode = cloneData(mockSmartCode) as undefined as Smartcode;

    expectedAreaFuncData.activeAssociationCol = false;
    expectedAreaFuncData.activeDistributionTot = false;
    expectedAreaFuncData.selection = 'WINNER';
    expectedAreaFuncData.value = 1;
    expectedAreaFuncData.amount = mockAmaunt;
    expectedAreaFuncData.typeSlipCol = mockTypeBetSlipColTot;
    expectedAreaFuncData.odds = [mockBetOdd];
    expectedAreaFuncData.firstTap = true;

    service.placingEvent.players = [mockPlayer];
    service.smartCode = smartCode;

    spyOn(productService.polyfunctionalAreaSubject, 'next');
    spyOnProperty(btncalcService, 'polyfunctionStakePresetPlayer')
      .and.returnValue(new PolyfunctionStakePresetPlayer(mockTypeBetSlipColTot, mockAmaunt));

    service.populatingPolyfunctionArea(mockVirtualBetEvent);

    expect(productService.polyfunctionalAreaSubject.next).toHaveBeenCalledWith(expectedAreaFuncData)
  });

  it('populatingPolyfunctionArea() should be emmit areaFuncData to productService.polyfunctionalAreaSubject (case 2)', () => {
    const mockAmaunt = 1;
    const mockTypeBetSlipColTot = TypeBetSlipColTot.COL;
    const mockOddLable = '1-2';
    const mockOddVl = 72.67;
    const mockOddId = 586983474;

    const mockPlayers = [
      {
        number: 1,
        selectable: true,
        actived: true,
        position: 1
      },
      {
        number: 2,
        selectable: true,
        actived: true,
        position: 2
      }
    ];

    const mockBetOdd = new BetOdd(mockOddLable, mockOddVl, mockAmaunt, mockOddId);
    const expectedAreaFuncData = new PolyfunctionalArea();

    const smartCode = cloneData(mockSmartCode) as undefined as Smartcode;

    expectedAreaFuncData.activeAssociationCol = false;
    expectedAreaFuncData.activeDistributionTot = false;
    expectedAreaFuncData.selection = 'AO';
    expectedAreaFuncData.value = '1-2';
    expectedAreaFuncData.amount = mockAmaunt;
    expectedAreaFuncData.typeSlipCol = mockTypeBetSlipColTot;
    expectedAreaFuncData.odds = [mockBetOdd];
    expectedAreaFuncData.firstTap = true;

    service.placingEvent.players = mockPlayers;
    service.smartCode = smartCode;

    spyOn(productService.polyfunctionalAreaSubject, 'next');
    spyOnProperty(btncalcService, 'polyfunctionStakePresetPlayer')
      .and.returnValue(new PolyfunctionStakePresetPlayer(mockTypeBetSlipColTot, mockAmaunt));

    service.populatingPolyfunctionArea(mockVirtualBetEvent);

    expect(productService.polyfunctionalAreaSubject.next).toHaveBeenCalledWith(expectedAreaFuncData)
  });

  it('extractOdd() should be extract odds (case 1)', () => {
    const mockAmaunt = 1;
    const mockOddLable = 'EVEN';
    const mockOddVl = 1.58;
    const mockOddId = 586983473;

    const mockBetOdd = new BetOdd(mockOddLable, mockOddVl, mockAmaunt, mockOddId);

    const smartCode = cloneData(mockSmartCode) as undefined as Smartcode;

    const mockAreaFuncData = new PolyfunctionalArea();
    mockAreaFuncData.selection = mockOddLable;
    mockAreaFuncData.amount = mockAmaunt;

    service.smartCode = smartCode;

    const result = service.extractOdd(mockVirtualBetEvent, mockAreaFuncData);

    expect(result.odds).toEqual([mockBetOdd]);
  });

  it('extractOdd() should be extract odds (case 2)', () => {
    const mockAmaunt = 1;
    const mockFuncDataValue = '1-2';
    const mockOddLable = 'AO';
    const mockOddVl = 72.67;
    const mockOddId = 586983474;

    const mockBetOdd = new BetOdd(mockFuncDataValue, mockOddVl, mockAmaunt, mockOddId);

    const smartCode = cloneData(mockSmartCode) as undefined as Smartcode;
    smartCode.code = mockOddLable;

    const mockAreaFuncData = new PolyfunctionalArea();
    mockAreaFuncData.selection = mockOddLable;
    mockAreaFuncData.value = mockFuncDataValue;
    mockAreaFuncData.amount = mockAmaunt;

    service.smartCode = smartCode;

    const result = service.extractOdd(mockVirtualBetEvent, mockAreaFuncData);

    expect(result.odds).toEqual([mockBetOdd]);
  });

  it('extractOdd() should be extract odds (case 3)', () => {
    const mockAmaunt = 1;
    const mockOddLable = 'WINNER';
    const mockOddVl = 4.73;
    const mockOddId = 586983469;
    const mockPlayerName = 'Lobo';

    const mockBetOdd = new BetOdd(mockPlayerName, mockOddVl, mockAmaunt, mockOddId);

    const smartCode = cloneData(mockSmartCode) as undefined as Smartcode;

    const mockAreaFuncData = new PolyfunctionalArea();
    mockAreaFuncData.selection = mockOddLable;
    mockAreaFuncData.amount = mockAmaunt;

    service.smartCode = smartCode;

    const result = service.extractOdd(mockVirtualBetEvent, mockAreaFuncData, mockPlayerName);

    expect(result.odds).toEqual([mockBetOdd]);
  });

  it('extractOdd() should be extract odds (case 4)', () => {
    const mockAmaunt = 1;
    const mockFuncDataValue = '1/23';
    const mockLable = 'VT';

    const mockOddLable1 = '1-2-3';
    const mockOddLable2 = '1-3-2';

    const mockOddVl1 = 505.52;
    const mockOddVl2 = 469.31;

    const mockOddId1 = 586983519;
    const mockOddId2 = 586983523;

    const mockBetOdds = [
      new BetOdd(mockOddLable1, mockOddVl1, mockAmaunt, mockOddId1),
      new BetOdd(mockOddLable2, mockOddVl2, mockAmaunt, mockOddId2),
    ];

    const smartCode = cloneData(mockSmartCode) as undefined as Smartcode;
    smartCode.code = mockLable;

    const mockAreaFuncData = new PolyfunctionalArea();
    mockAreaFuncData.selection = mockLable;
    mockAreaFuncData.value = mockFuncDataValue;
    mockAreaFuncData.amount = mockAmaunt;

    service.smartCode = smartCode;

    const result = service.extractOdd(mockVirtualBetEvent, mockAreaFuncData);

    expect(result.odds).toEqual(mockBetOdds);
  });

  it('getMarketIdentifier() should be get the market identifier', () => {
    mockDataMarketIdentifier.forEach(data => {
      expect(service.getMarketIdentifier(data.marketId)).toBe(data.result);
    })
  });

  it('typeSelection() should be return a tp correspondence value for map it on feed', () => {
    mockDataTypeSelection.forEach(data => {
      expect(service.typeSelection(data.selection)).toBe(data.result);
    })
  });

  it('generateOdds() should be generate all combinations of bets from all the rows selections', () => {
    mockDataGenerateOdds.forEach(data => {
      expect(service.generateOdds(
        data.args.value, 
        data.args.combinationType, 
        data.args.ordered, 
        data.args.withReturn, 
        data.args.isFirstRowFixed
      )).toEqual(data.result);
    })
  });

  it('generateOddsRow() should be generate all combinations of bets from a single row selections', () => {
    mockDataGenerateOddsRow.forEach(data => {
      expect(service.generateOddsRow(
        data.args.value, 
        data.args.combinationType, 
        data.args.ordered, 
        data.args.withReturn, 
      )).toEqual(data.result);
    })
  });

  it('extractOddFromString() should be extract the selection form the smarcode', () => {
    expect(service.extractOddFromString('TOX')).toEqual(['T', 'O', 'X']);
  });

  it('getCurrentEvent() should be extract the current event selected', async () => {
    spyOn(service, 'currentAndSelectedEventTime');
    service.eventDetails = new EventDetail(mockProduct.layoutProducts.nextEventItems);
    service.placingEvent = cloneData(mockPlacingEvent) as undefined as PlacingEvent;
    productService.product = mockProduct;
    await service.loadEventsFromApi(); // set cacheEvents
    
    await service.getCurrentEvent().then(response => {
      expect(response).toEqual(mockVirtualBetEvent)
    })
  });

  it('getCurrentTournament() should be extract the current tournament selected', async () => {
    spyOn(service, 'currentAndSelectedEventTime');
    spyOn(elysApiService.virtual, 'getVirtualTreeV2').and.returnValue(Promise.resolve(mockVirtualProgramTreeBySportResponseSoccer))
    service.eventDetails = new EventDetail(mockProductSoccer.layoutProducts.nextEventItems);
    service.placingEvent = cloneData(mockPlacingEvent) as undefined as PlacingEvent;
    service.placingEvent.eventNumber = mockFirstEvIdSoccer;
    productService.product = mockProductSoccer;
    await service.loadEventsFromApi(); // set cacheTournaments
    
    await service.getCurrentTournament().then(response => {
      expect(response).toEqual(mockTournamentDetails)
    })
  });

  it('placingNumber() should be push selected KenoNumber to placingEvent and call populatingPolyfunctionAreaByLottery', () => {
    spyOn(service, 'populatingPolyfunctionAreaByLottery');
    const mockKenoNumber = {
      number: 10,
      isSelected: true,
    }
    service.placingNumber(mockKenoNumber);

    expect(service.placingEvent.kenoNumbers[0]).toEqual(mockKenoNumber);
    expect(service.populatingPolyfunctionAreaByLottery).toHaveBeenCalled();
  });

  it('placingNumber() should be remove selected KenoNumber from placingEvent and call populatingPolyfunctionAreaByLottery', () => {
    spyOn(service, 'populatingPolyfunctionAreaByLottery');
    const mockKenoNumber = {
      number: 10,
      isSelected: true,
    };
    const mockKenoNumbers = [
      mockKenoNumber
    ];

    service.placingEvent.kenoNumbers = mockKenoNumbers; //set KenoNumbers

    service.placingNumber(mockKenoNumber);
    // check if mockKenoNumber exists
    expect(service.placingEvent.kenoNumbers.findIndex(item => item.number === mockKenoNumber.number)).toBe(-1);
    expect(service.populatingPolyfunctionAreaByLottery).toHaveBeenCalled();
  });

  it('populatingPolyfunctionAreaByLottery() should be emmit areaFuncData to productService.polyfunctionalAreaSubject', () => {
    const mockAmaunt = 1;
    const mockTypeBetSlipColTot = TypeBetSlipColTot.GROUP;
    const mockEvId = mockFirstSlsId;
    const mockKenoNumber = {
      number: 10,
      isSelected: true,
    };
    const mockKenoNumbers = [
      mockKenoNumber
    ];
    // to do: 
    // set mockEvId instead of 4th argument(undefined) of new BetOdd when will fixed async call in original function
    const mockBetOdd = new BetOdd(undefined, 1, mockAmaunt, undefined);
    const expectedAreaFuncData = new PolyfunctionalArea();
    expectedAreaFuncData.activeAssociationCol = false;
    expectedAreaFuncData.activeDistributionTot = false;
    expectedAreaFuncData.selection = 'V';
    expectedAreaFuncData.value = 0;
    expectedAreaFuncData.amount = mockAmaunt;
    expectedAreaFuncData.typeSlipCol = mockTypeBetSlipColTot;
    expectedAreaFuncData.odds = [mockBetOdd];
    expectedAreaFuncData.firstTap = true;

    spyOn(productService.polyfunctionalAreaSubject, 'next');
    spyOn(service, 'getCurrentEvent').and.returnValue(Promise.resolve(mockVirtualBetEvent));
    spyOnProperty(btncalcService, 'polyfunctionStakePresetPlayer')
      .and.returnValue(new PolyfunctionStakePresetPlayer(mockTypeBetSlipColTot, mockAmaunt));

    service.placingEvent.kenoNumbers = mockKenoNumbers; //set KenoNumbers

    service.populatingPolyfunctionAreaByLottery();

    expect(productService.polyfunctionalAreaSubject.next).toHaveBeenCalledWith(expectedAreaFuncData);
  });

  it('placingColoursNumber() should be push selected number to placingEvent and call populatingPolyfunctionAreaByColours', () => {
    spyOn(service, 'populatingPolyfunctionAreaByColours');
    const mockColorNumber = 1;

    service.placingColoursNumber(mockColorNumber);

    expect(service.placingEvent.coloursNumbers[0]).toEqual(mockColorNumber);
    expect(service.populatingPolyfunctionAreaByColours).toHaveBeenCalled();
  });

  it('placingColoursNumber() should be removed selected number from placingEvent and call populatingPolyfunctionAreaByColours', () => {
    spyOn(service, 'populatingPolyfunctionAreaByColours');
    const mockColorNumber = 1;

    service.placingEvent.coloursNumbers = [mockColorNumber]; //set ColorNumber

    service.placingColoursNumber(mockColorNumber);

    // check if mockColorNumber exists
    expect(service.placingEvent.coloursNumbers.findIndex(item => item === mockColorNumber)).toBe(-1);
    expect(service.populatingPolyfunctionAreaByColours).toHaveBeenCalled();
  });

  it('placingColoursSelection() should set selection to placingEvent and call populatingPolyfunctionAreaByColours', () => {
    spyOn(service, 'populatingPolyfunctionAreaByColours');
    const mockColorSelected = 'LO';

    service.placingColoursSelection(mockColorSelected);

    expect(service.placingEvent.coloursSelection).toEqual(mockColorSelected);
    expect(service.populatingPolyfunctionAreaByColours).toHaveBeenCalled();
  });

  it('placingColoursSelection() should unset selection from placingEvent and call populatingPolyfunctionAreaByColours', () => {
    spyOn(service, 'populatingPolyfunctionAreaByColours');
    const mockColorSelected = 'LO';

    service.placingEvent.coloursSelection = mockColorSelected; //set ColorSelection

    service.placingColoursSelection(mockColorSelected);

    expect(service.placingEvent.coloursSelection).not.toBeDefined();
    expect(service.populatingPolyfunctionAreaByColours).toHaveBeenCalled();
  });

  it('placingColoursSelection() should change selection from placingEvent and call populatingPolyfunctionAreaByColours', () => {
    spyOn(service, 'populatingPolyfunctionAreaByColours');
    const mockColorSelected = 'LO';
    const expectedColorSelected = 'HI';
    service.placingEvent.coloursSelection = mockColorSelected; //set ColorSelection

    service.placingColoursSelection(expectedColorSelected);

    expect(service.placingEvent.coloursSelection).toEqual(expectedColorSelected);
    expect(service.populatingPolyfunctionAreaByColours).toHaveBeenCalled();
  });

  it('populatingPolyfunctionAreaByColours() should be emmit areaFuncData to productService.polyfunctionalAreaSubject (case 1)', () => {
    const mockAmaunt = 1;
    const mockTypeBetSlipColTot = TypeBetSlipColTot.GROUP;
    const mockEvId = mockFirstSlsId;
    const mockColorNumber = 1;

    // to do: 
    // set mockEvId instead of 4th argument(undefined) of new BetOdd when will fixed async call in original function
    const mockBetOdd = new BetOdd(undefined, 1, mockAmaunt, undefined);
    const expectedAreaFuncData = new PolyfunctionalArea();
    expectedAreaFuncData.activeAssociationCol = false;
    expectedAreaFuncData.activeDistributionTot = false;
    expectedAreaFuncData.selection = 'bet49';
    expectedAreaFuncData.value = 0;
    expectedAreaFuncData.amount = mockAmaunt;
    expectedAreaFuncData.typeSlipCol = mockTypeBetSlipColTot;
    expectedAreaFuncData.odds = [mockBetOdd];
    expectedAreaFuncData.firstTap = true;

    spyOn(productService.polyfunctionalAreaSubject, 'next');
    spyOn(service, 'getCurrentEvent').and.returnValue(Promise.resolve(mockVirtualBetEvent));
    spyOnProperty(btncalcService, 'polyfunctionStakePresetPlayer')
      .and.returnValue(new PolyfunctionStakePresetPlayer(mockTypeBetSlipColTot, mockAmaunt));

    service.placingEvent.coloursNumbers = [mockColorNumber]; //set ColoursNumbers

    service.populatingPolyfunctionAreaByColours();

    expect(productService.polyfunctionalAreaSubject.next).toHaveBeenCalledWith(expectedAreaFuncData);
  });

  it('populatingPolyfunctionAreaByColours() should be emmit areaFuncData to productService.polyfunctionalAreaSubject (case 2)', () => {
    const mockAmaunt = 1;
    const mockTypeBetSlipColTot = TypeBetSlipColTot.GROUP;
    const mockEvId = mockFirstSlsId;
    const mockSelection = 'hilo';
    const mockColorSelection = 'HI';

    // to do: 
    // set mockEvId instead of 4th argument(undefined) of new BetOdd when will fixed async call in original function
    const mockBetOdd = new BetOdd(mockColorSelection, 1, mockAmaunt, undefined);
    const expectedAreaFuncData = new PolyfunctionalArea();
    expectedAreaFuncData.activeAssociationCol = false;
    expectedAreaFuncData.activeDistributionTot = false;
    expectedAreaFuncData.selection = mockSelection;
    expectedAreaFuncData.value = 0;
    expectedAreaFuncData.amount = mockAmaunt;
    expectedAreaFuncData.typeSlipCol = mockTypeBetSlipColTot;
    expectedAreaFuncData.odds = [mockBetOdd];
    expectedAreaFuncData.firstTap = true;

    spyOn(productService.polyfunctionalAreaSubject, 'next');
    spyOn(service, 'getCurrentEvent').and.returnValue(Promise.resolve(mockVirtualBetEvent));
    spyOnProperty(btncalcService, 'polyfunctionStakePresetPlayer')
      .and.returnValue(new PolyfunctionStakePresetPlayer(mockTypeBetSlipColTot, mockAmaunt));

    service.selectedColourGameId = ColourGameId[mockSelection]; //set color game
    service.placingEvent.coloursSelection = mockColorSelection; //set ColoursSelection

    service.populatingPolyfunctionAreaByColours();

    expect(productService.polyfunctionalAreaSubject.next).toHaveBeenCalledWith(expectedAreaFuncData);
  });

  it('placingNumberRoulette() should set odd to placingEvent and call populatingPolyfunctionAreaByARoulette', () => {
    spyOn(service, 'populatingPolyfunctionAreaByARoulette');
    const mockMarketId = 725;
    const mockOdd = {
      id: 590467734,
      nm: '1',
      tp: 3,
      ods: [
        {
          vl: 36,
          st: 1
        }
      ],
    };
    const mockSmartBet = 27;
    const mockSmartCode = undefined;
    const expectedOdd = cloneData(mockOdd) as undefined as VirtualBetSelectionExtended;
    expectedOdd.marketId = mockMarketId;

    service.placingNumberRoulette(mockMarketId, mockOdd, mockSmartBet, mockSmartCode);

    expect(service.placingEvent.odds).toEqual([expectedOdd]);
    expect(service.populatingPolyfunctionAreaByARoulette).toHaveBeenCalledWith(mockSmartBet, mockSmartCode);
  });

  it('placingNumberRoulette() should remove odd from placingEvent and call populatingPolyfunctionAreaByARoulette', () => {
    spyOn(service, 'populatingPolyfunctionAreaByARoulette');
    const mockMarketId = 725;
    const mockOdd = {
      id: 590467734,
      nm: '1',
      tp: 3,
      ods: [
        {
          vl: 36,
          st: 1
        }
      ],
    };
    const mockSmartBet = 27;
    const mockSmartCode = undefined;
    const expectedOdd = cloneData(mockOdd) as undefined as VirtualBetSelectionExtended;
    expectedOdd.marketId = mockMarketId;

    service.placingEvent.odds = [expectedOdd];

    service.placingNumberRoulette(mockMarketId, mockOdd, mockSmartBet, mockSmartCode);

    // check if mockOdd exists
    expect(service.placingEvent.odds.findIndex(item => item.id === mockOdd.id)).toBe(-1);
    expect(service.populatingPolyfunctionAreaByARoulette).toHaveBeenCalledWith(mockSmartBet, mockSmartCode);
  });

  it('populatingPolyfunctionAreaByARoulette() should be emmit areaFuncData to productService.polyfunctionalAreaSubject', () => {
    const mockSmartBet = 27;
    const mockAmaunt = 1;
    const mockTypeBetSlipColTot = TypeBetSlipColTot.COL;
    const mockOddId = 590503279;
    const mockSelection = 'R';
    const mockSelectionIdentifier = '10';
    const mockOddValue = 36;
    const mockOdd = {
      id: mockOddId,
      nm: mockSelectionIdentifier,
      tp: 12,
      ods: [
        {
          vl: mockOddValue,
          st: 1
        }
      ],
      marketId: 725
    };
    const mockBetOdd = new BetOdd(mockSelectionIdentifier, mockOddValue, mockAmaunt, mockOddId);
    const expectedAreaFuncData = new PolyfunctionalArea();
    expectedAreaFuncData.activeAssociationCol = false;
    expectedAreaFuncData.activeDistributionTot = false;
    expectedAreaFuncData.selection = mockSelection;
    expectedAreaFuncData.value = mockSelectionIdentifier;
    expectedAreaFuncData.amount = mockAmaunt;
    expectedAreaFuncData.typeSlipCol = mockTypeBetSlipColTot;
    expectedAreaFuncData.odds = [mockBetOdd];
    expectedAreaFuncData.firstTap = true;

    spyOn(productService.polyfunctionalAreaSubject, 'next');
    spyOnProperty(btncalcService, 'polyfunctionStakePresetPlayer')
      .and.returnValue(new PolyfunctionStakePresetPlayer(mockTypeBetSlipColTot, mockAmaunt));

    service.placingEvent.odds = [mockOdd];

    service.populatingPolyfunctionAreaByARoulette(mockSmartBet);

    expect(productService.polyfunctionalAreaSubject.next).toHaveBeenCalledWith(expectedAreaFuncData);
  });

  it('fireCurrentEventChange() should be emmit selected to currentEventSubscribe', () => {
    const mockSelected = 10;
    spyOn(service.currentEventSubscribe, 'next');

    service.eventDetails = mockEventDetail;

    service.fireCurrentEventChange(mockSelected);

    expect(service.currentEventSubscribe.next).toHaveBeenCalledWith(mockSelected);
    expect(service.toResetAllSelections).toBeTrue();
  });

  it('fireCurrentEventChange() should be call openDestroyCouponDialog', () => {
    const mockSelected = 10;
    spyOn(service.currentEventSubscribe, 'next');
    spyOnProperty(couponService, 'coupon').and.returnValue(mockCoupon);

    service.eventDetails = mockEventDetail;

    service.fireCurrentEventChange(mockSelected);

    expect(service.currentEventSubscribe.next).toHaveBeenCalledWith(mockSelected);
    expect(destroyCouponService.openDestroyCouponDialog).toHaveBeenCalled();
    expect(service.toResetAllSelections).toBeTrue();
  });

  it('fireChangeColoursGame() should be set selectedColourGameId and call resetPlayEvent', () => {
    const mockcolourGameId = ColourGameId.betzero;
    spyOn(service, 'resetPlayEvent');

    service.fireChangeColoursGame(mockcolourGameId);

    expect(service.selectedColourGameId).toBe(mockcolourGameId);
    expect(service.resetPlayEvent).toHaveBeenCalled();
  });

  it('fireChangeColoursGame() should be set selectedColourGameId and call openDestroyCouponDialog', () => {
    const mockcolourGameId = ColourGameId.betzero;
    spyOn(service, 'resetPlayEvent');
    spyOnProperty(couponService, 'coupon').and.returnValue(mockCoupon);

    service.fireChangeColoursGame(mockcolourGameId);

    expect(service.selectedColourGameId).toBe(mockcolourGameId);
    expect(service.resetPlayEvent).toHaveBeenCalled();
    expect(destroyCouponService.openDestroyCouponDialog).toHaveBeenCalled();
  });

});