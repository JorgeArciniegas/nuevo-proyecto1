import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { StagedCouponDetail, SummaryCoupon } from "@elys/elys-api";
import { ElysCouponService } from "@elys/elys-coupon";
import { mockSummuryCoupon } from "src/app/mock/coupon.mock";
import { cloneData } from "src/app/mock/helpers/clone-mock.helper";
import { ElysCouponServiceStub } from "src/app/mock/stubs/elys-coupon-service.stub";
import { RouterServiceStub } from "src/app/mock/stubs/router.stub";
import { RouterService } from "src/app/services/utility/router/router.service";
import { PrintCouponService } from "./print-coupon.service";

describe('PrintCouponService', () => {
  let service: PrintCouponService;
  let routerService: RouterService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PrintCouponService,
        { provide: ElysCouponService, useClass: ElysCouponServiceStub},
        { provide: RouterService, useClass: RouterServiceStub}
      ],
    });

    var dummyElement = document.createElement('div');
    document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);
    window.print = jasmine.createSpy('print');

    service = TestBed.inject(PrintCouponService);
    routerService = TestBed.inject(RouterService);

    jasmine.clock().install();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should reprint coupon', () => {
    const coupon: SummaryCoupon = cloneData(mockSummuryCoupon);
    const couponPrint: StagedCouponDetail = (coupon as unknown) as StagedCouponDetail;
    const fakeDate: Date = new Date(1658137844642);

    jasmine.clock().mockDate(fakeDate);
    spyOn(service, 'printWindow');
    service.reprintCoupon(coupon);

    expect(service.couponPrint).toEqual(couponPrint);
    expect(service.isPrintAgainst).toBeTrue();
    expect(service.reprintDate).toEqual(fakeDate);
    expect(service.printWindow).toHaveBeenCalled();
  });

  it('should print window', fakeAsync(() => {
    service.couponPrint = cloneData(mockSummuryCoupon) as unknown as StagedCouponDetail;

    spyOn(service, 'checkProduct');

    service.printWindow();
    // tick(1250) because printWindow function has timer(250) and constructor has timer(1000)
    tick(1250);

    expect(routerService.getRouter().navigate).toHaveBeenCalledWith(['/', { outlets: { print: 'print-coupon' } }]);
    expect(service.checkProduct).toHaveBeenCalled();
    expect(window.print).toHaveBeenCalled();
  }));

  it('should check Keno product', () => {
    service.couponPrint = cloneData(mockSummuryCoupon) as unknown as StagedCouponDetail;
    service.couponPrint.Odds[0].SportName = 'Keno';

    service.checkProduct();
    expect(service.couponPrint.Product).toEqual('NUMBERS');
  });

  it('should check Colors product', () => {
    service.couponPrint = cloneData(mockSummuryCoupon) as unknown as StagedCouponDetail;
    service.couponPrint.Odds[0].SportName = 'Colors';

    service.checkProduct();
    expect(service.couponPrint.Product).toEqual('NUMBERS');
  });

  it('should check Roulette product', () => {
    service.couponPrint = cloneData(mockSummuryCoupon) as unknown as StagedCouponDetail;
    service.couponPrint.Odds[0].SportName = 'Roulette';

    service.checkProduct();
    expect(service.couponPrint.Product).toEqual('ROULETTE');
  });

  it('should check Soccer product', () => {
    service.couponPrint = cloneData(mockSummuryCoupon) as unknown as StagedCouponDetail;
    service.couponPrint.Odds[0].SportName = 'Soccer';

    service.checkProduct();
    expect(service.couponPrint.Product).toEqual('VIRT');
  });

});
