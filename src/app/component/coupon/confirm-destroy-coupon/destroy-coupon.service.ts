import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CouponService } from '../coupon.service';
import { ConfirmDestroyCouponComponent } from './confirm-destroy-coupon.component';
import { UserService } from '../../../../../src/app/services/user.service';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DestroyCouponService {
  public dialogRef: MatDialogRef<ConfirmDestroyCouponComponent> = null;
  public showDialog = false;
  public confirmDestroySub: Subject<boolean>;
  public confirmDestroyObs: Observable<boolean>;
  constructor(
    private dialog: MatDialog,
    private couponservice: CouponService,
    private userService: UserService
  ) { }

  openDestroyCouponDialog(racing?: string | boolean, product?: string): void {
    this.close();
    this.userService.isModalOpen = true;
    this.userService.isBtnCalcEditable = false;
    this.dialogRef = this.dialog.open(ConfirmDestroyCouponComponent, {
      data: { racing: racing, product: product, confirm: false },
      id: 'destroy-coupon-dialog',
      hasBackdrop: false
    });
    this.dialogRef.afterClosed().subscribe(elem => {
      if (elem) {
        this.couponservice.resetCoupon();
      }
    });
  }

  close(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.userService.isModalOpen = false;
      this.userService.isBtnCalcEditable = true;
    }
  }

  getConfirmDestroySubProductObs(): Observable<boolean> {
    return null;
  }
}
