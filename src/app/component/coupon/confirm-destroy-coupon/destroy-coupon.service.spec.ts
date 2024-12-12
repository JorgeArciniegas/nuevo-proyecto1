import { TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { CouponServiceStub } from "src/app/mock/stubs/coupon-service.stub";
import { MatDialogRefStub, MatDialogStub } from "src/app/mock/stubs/mat-dialog.stub";
import { UserService } from "src/app/services/user.service";
import { CouponService } from "../coupon.service";
import { ConfirmDestroyCouponComponent } from "./confirm-destroy-coupon.component";
import { DestroyCouponService } from "./destroy-coupon.service";

class UserServiceStub {
  isModalOpen: boolean;
  isBtnCalcEditable: boolean;
}

describe('DestroyCouponService', () => {
  let service: DestroyCouponService;
  let dialog: MatDialog;
  let dialogRef: MatDialogRef<ConfirmDestroyCouponComponent>;
  let userService: UserService;
  let couponService: CouponService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DestroyCouponService,
        { provide: MatDialog, useClass: MatDialogStub},
        { provide: MatDialogRef, useClass: MatDialogRefStub},
        { provide: CouponService, useClass: CouponServiceStub},
        { provide: UserService, useClass: UserServiceStub}
      ],
    });

    service = TestBed.inject(DestroyCouponService);
    dialog = TestBed.inject(MatDialog);
    dialogRef = TestBed.inject(MatDialogRef);
    userService = TestBed.inject(UserService);
    couponService = TestBed.inject(CouponService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open Destroy Coupon dialog', () => {
    const racing: string | boolean = null;
    const product: string = null;

    const expectedConfigs: any = {
      data: { racing: racing, product: product, confirm: false },
      id: 'destroy-coupon-dialog',
      hasBackdrop: false
    };

    spyOn(service, 'close');
    dialog.open = jasmine.createSpy('open').and.returnValue(dialogRef);

    service.openDestroyCouponDialog(racing, product);

    expect(dialog.open).toHaveBeenCalledWith(ConfirmDestroyCouponComponent, expectedConfigs);
    expect(userService.isModalOpen).toBeTrue();
    expect(userService.isBtnCalcEditable).toBeFalse();

    service.dialogRef.close();
    expect(couponService.resetCoupon).toHaveBeenCalled();
  });

  it('should close coupon dialog', () => {
    dialog.open = jasmine.createSpy('open').and.returnValue(dialogRef);
    service.openDestroyCouponDialog();

    service.close();

    expect(service.dialogRef.close).toHaveBeenCalled();
    expect(userService.isModalOpen).toBeFalse();
    expect(userService.isBtnCalcEditable).toBeTrue();
  });

  it('should confirm destroy product', () => {
    const result = service.getConfirmDestroySubProductObs();
    expect(result).toEqual(null);
  });
});
