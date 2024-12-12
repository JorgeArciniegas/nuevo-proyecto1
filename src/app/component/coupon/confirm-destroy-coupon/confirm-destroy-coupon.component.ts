import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CouponService } from '../coupon.service';
import { UserService } from '../../../../../src/app/services/user.service';

@Component({
  selector: 'app-confirm-destroy-coupon',
  templateUrl: './confirm-destroy-coupon.component.html',
  styleUrls: ['./confirm-destroy-coupon.component.scss']
})
export class ConfirmDestroyCouponComponent implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDestroyCouponComponent>,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.changeClassApp('modal-center');
  }

  ngOnDestroy(): void {
    this.changeClassApp('modal-center');
  }

  selectedOperation(sel: boolean): void {
    this.dialogRef.close(sel);
    this.userService.isModalOpen = false;
    this.userService.isBtnCalcEditable = true;
  }

  private changeClassApp(newClass: string): void {
    const elem: HTMLElement = document.querySelector('body');

    if (elem.classList.contains(newClass)) {
      elem.classList.remove(newClass);
    } else {
      elem.classList.add(newClass);
    }
  }
}
