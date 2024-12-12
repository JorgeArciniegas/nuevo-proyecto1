import { Observable, Subject } from "rxjs";
import { InternalCoupon, OddsStakeEdit } from "src/app/component/coupon/coupon.model";
import { CouponConfirmDelete } from "src/app/products/products.model";
import { mockCoupon } from "../coupon.mock";
import { cloneData } from "../helpers/clone-mock.helper";

export class CouponServiceStub {
  couponHasBeenPlacedSub: Subject<boolean>;
  couponHasBeenPlacedObs: Observable<boolean>;

  oddStakeEdit: OddsStakeEdit;
  coupon: InternalCoupon;
  productHasCoupon: CouponConfirmDelete;

  constructor() {
    this.coupon = cloneData(mockCoupon);
    this.productHasCoupon = {
      productCodeRequest: 'DOG',
      checked: false
    };

    this.couponHasBeenPlacedSub = new Subject<boolean>();
    this.couponHasBeenPlacedObs = this.couponHasBeenPlacedSub.asObservable();
  }

  updateCoupon = jasmine.createSpy('updateCoupon');
  addRemoveToCouponSC = jasmine.createSpy('addRemoveToCouponSC');
  addRemoveToCoupon = jasmine.createSpy('addRemoveToCoupon');
  addToRemoveToCouponLottery = jasmine.createSpy('addToRemoveToCouponLottery');
  addToRemoveToCouponColours = jasmine.createSpy('addToRemoveToCouponColours');
  multiAddToCouponColours = jasmine.createSpy('multiAddToCouponColours');
  resetCoupon = jasmine.createSpy('resetCoupon');
  checkHasCoupon = jasmine.createSpy('checkHasCoupon');
}
