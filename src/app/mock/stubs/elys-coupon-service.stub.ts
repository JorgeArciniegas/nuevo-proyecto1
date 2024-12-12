import { StagedCouponDetail } from "@elys/elys-api";
import { BetCouponExtended, CouponDataConfig, CouponServiceMessage, QueueBidResponse } from "@elys/elys-coupon";
import { Observable, Subject } from "rxjs";

export class ElysCouponServiceStub {
  couponHasChangedSubject: Subject<BetCouponExtended>;
  couponHasChanged: Observable<BetCouponExtended>;

  couponServiceMessageSubject: Subject<CouponServiceMessage>;
  couponServiceMessage: Observable<CouponServiceMessage>;

  stagedCouponSubject: Subject<StagedCouponDetail[]>;
  stagedCouponObs: Observable<StagedCouponDetail[]>;

  private couponBidProcessedSubject: Subject<QueueBidResponse[]>;
  couponBidProcessed: Observable<QueueBidResponse[]>;

  couponConfig: CouponDataConfig;
  betCoupon: BetCouponExtended;

  constructor() {
    this.couponHasChangedSubject = new Subject<BetCouponExtended>();
    this.couponHasChanged = this.couponHasChangedSubject.asObservable();

    this.couponServiceMessageSubject = new Subject<CouponServiceMessage>();
    this.couponServiceMessage = this.couponServiceMessageSubject.asObservable();

    this.stagedCouponSubject = new Subject<StagedCouponDetail[]>();
    this.stagedCouponObs = this.stagedCouponSubject.asObservable();

    this.couponBidProcessedSubject = new Subject<QueueBidResponse[]>();
    this.couponBidProcessed = this.couponBidProcessedSubject.asObservable();

    this.couponConfig = {
      deviceLayout: 8,
      userId: undefined
    }
  }

  manageOdd = jasmine.createSpy('manageOdd');
  manageOddSC = jasmine.createSpy('manageOddSC');
  manageOddLottery = jasmine.createSpy('manageOddLottery');
  manageOddColours = jasmine.createSpy('manageOddColours');
  manageColoursMultiOddSC = jasmine.createSpy('manageColoursMultiOddSC');

  placeCouponLottery = jasmine.createSpy('placeCouponLottery');
  placeCouponColours = jasmine.createSpy('placeCouponColours');
  placeCoupon = jasmine.createSpy('placeCoupon');

  updateCouponLottery = jasmine.createSpy('updateCouponLottery');
  updateCouponColours = jasmine.createSpy('updateCouponColours');
  updateCoupon = jasmine.createSpy('updateCoupon');
}
