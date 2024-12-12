import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PayCancelDialogComponent } from './pay-cancel-dialog/pay-cancel-dialog.component';
import { DialogTypeCoupon } from '../../../../src/app/products/products.model';
import { UserService } from '../../../../src/app/services/user.service';

@Injectable(/* {
  providedIn: 'root'
} */)
export class CouponDialogService {
  public dialogRef: MatDialogRef<PayCancelDialogComponent> = null;
  public showDialog = false;
  public type: DialogTypeCoupon;

  constructor(private dialog: MatDialog, private userService: UserService) { }

  openPayCancelDialog(type: DialogTypeCoupon): void {
    this.close();
    this.userService.isModalOpen = true;
    this.userService.isBtnCalcEditable = false;
    this.dialogRef = this.dialog.open(PayCancelDialogComponent, {
      disableClose: true,
      data: type,
      id: 'pay-cancel-dialog',
      hasBackdrop: false
    });
  }

  close(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.userService.isModalOpen = false;
      this.userService.isBtnCalcEditable = true;
    }
  }

  closeDialog() { }

}
