import { TestBed } from "@angular/core/testing";
import { DestroyCouponService } from "src/app/component/coupon/confirm-destroy-coupon/destroy-coupon.service";
import { CouponService } from "src/app/component/coupon/coupon.service";
import { RouterService } from "src/app/services/utility/router/router.service";
import { ProductsServiceExtra } from "src/app/products/product.service.extra";
import { Subject } from "rxjs";
import { mockProduct } from "../mock/product.mock";
import { RouterServiceStub } from "../mock/stubs/router.stub";
import { MatDialogRefStub } from "../mock/stubs/mat-dialog.stub";
import { CouponServiceStub } from "../mock/stubs/coupon-service.stub";
import { cloneData } from "../mock/helpers/clone-mock.helper";

class DestroyCouponServiceStub {
  openDestroyCouponDialog = jasmine.createSpy('openDestroyCouponDialog');
  dialogRef = new MatDialogRefStub();
}

describe('ProductsServiceExtra', () => {
  let service: ProductsServiceExtra;
  let couponService: CouponService;
  let destroyCouponService: DestroyCouponService;
  let routerService: RouterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CouponService, useClass: CouponServiceStub },
        { provide: DestroyCouponService, useClass: DestroyCouponServiceStub },
        { provide: RouterService, useClass: RouterServiceStub }
      ],
    });

    couponService = TestBed.inject(CouponService);
    destroyCouponService = TestBed.inject(DestroyCouponService);
    routerService = TestBed.inject(RouterService);

    service = new ProductsServiceExtra(couponService, destroyCouponService, routerService);
    service.productNameSelectedSubscribe = new Subject();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should change product and destroy coupon', () => {
    const codeProduct: string = 'DOG';
    couponService.productHasCoupon.checked = true;

    service.productNameSelectedSubscribe.subscribe(result => {
      expect(result).toEqual(codeProduct);
    });

    service.changeProduct(codeProduct);

    expect(couponService.checkHasCoupon).toHaveBeenCalled();
    expect(couponService.productHasCoupon.productCodeRequest).toEqual(codeProduct);
    expect(destroyCouponService.openDestroyCouponDialog).toHaveBeenCalled();
    expect(routerService.getRouter().navigate).toHaveBeenCalledWith(['/products/main']);
  });

  it('should change product when coupon is empty', () => {
    const codeProduct: string = 'DOG';
    couponService.productHasCoupon.checked = false;

    service.productNameSelectedSubscribe.subscribe(result => {
      expect(result).toEqual(codeProduct);
    });

    service.changeProduct(codeProduct);

    expect(routerService.getRouter().navigate).toHaveBeenCalledWith(['/products/main']);
  });

  it('should change product when the productCode is equal to the current one', () => {
    const codeProduct: string = 'DOG';
    service.product = cloneData(mockProduct);
    service.product.codeProduct = codeProduct;

    service.productNameSelectedSubscribe.subscribe(result => {
      expect(result).toEqual(codeProduct);
    });

    service.changeProduct(codeProduct);

    expect(routerService.getRouter().navigate).toHaveBeenCalledWith(['/products/main']);
  });

});
