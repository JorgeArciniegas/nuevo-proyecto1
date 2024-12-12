import { TestBed } from "@angular/core/testing";
import { AppSettings } from "../app.settings";
import { DestroyCouponService } from "../component/coupon/confirm-destroy-coupon/destroy-coupon.service";
import { CouponService } from "../component/coupon/coupon.service";
import { mockProduct } from "../mock/product.mock";
import { RouterServiceStub } from "../mock/stubs/router.stub";
import { UserService } from "../services/user.service";
import { RouterService } from "../services/utility/router/router.service";
import { DialogService } from "./dialog.service";
import { BetDataDialog, DialogData, PolyfunctionalStakeCoupon } from "./products.model";
import { ProductsService } from "./products.service";

class DialogServiceStub {
  openDialog = jasmine.createSpy('openDialog');
  closeDialog = jasmine.createSpy('closeDialog');
}

describe('ProductsService', () => {
  let service: ProductsService;
  let dialog: DialogService;
  let appSettings: AppSettings;
  let routerService: RouterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductsService,
        AppSettings,
        { provide: DialogService, useClass: DialogServiceStub },
        { provide: CouponService, useValue: {} },
        { provide: DestroyCouponService, useValue: {} },
        { provide: UserService, useValue: {} },
        { provide: RouterService, useClass: RouterServiceStub }
      ],
    });

    service = TestBed.inject(ProductsService);
    dialog = TestBed.inject(DialogService);
    appSettings = TestBed.inject(AppSettings);
    routerService = TestBed.inject(RouterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open product dialog', () => {
    const data: BetDataDialog = {
      title: "WINNER",
      betOdds: {
        odds: [{ id: 575204610, label: 'Diamond Shoal', odd: 10.09, amount: 1, selected: true }],
      }
    };

    const dialogData: DialogData = new DialogData();
    dialogData.betOdds = data.betOdds;
    dialogData.breakpoint = service.breakpoint;
    dialogData.title = data.title;
    dialogData.betCoupon = undefined;
    dialogData.statistics = undefined;
    dialogData.groupings = undefined;
    dialogData.tournamentRanking = undefined;
    dialogData.paytable = undefined;
    dialogData.hotAndCold = undefined;

    service.openProductDialog(data);
    expect(dialog.openDialog).toHaveBeenCalledWith(dialogData)
  });

  it('should close product dialog', () => {
    service.closeProductDialog();
    expect(dialog.closeDialog).toHaveBeenCalled();
  });

  it('should reset board', () => {
    service.playableBoardResetObserve.subscribe(result => {
      expect(result).toBeTrue();
    });
    service.polyfunctionalStakeCouponSubject.subscribe(result => {
      expect(result).toEqual(new PolyfunctionalStakeCoupon());
    });

    service.resetBoard();
  });

  it('should check default product and navigate to it', () => {
    spyOn(service, 'changeProduct');

    service.checkDefaultProduct();
    expect(service.changeProduct).toHaveBeenCalled();
  });

  it('should navigate to admin because default product is not playable', () => {
    appSettings.products = [{
      ...mockProduct,
      isPlayable: false
    }];

    service.checkDefaultProduct();
    expect(routerService.getRouter().navigateByUrl).toHaveBeenCalledWith('/admin');
  });

});
