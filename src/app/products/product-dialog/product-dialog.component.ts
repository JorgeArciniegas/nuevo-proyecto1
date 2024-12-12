import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserService } from '../../../../src/app/services/user.service';
import { AppSettings } from '../../app.settings';
import { CouponService } from '../../component/coupon/coupon.service';
import { DialogData } from '../products.model';
@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class ProductDialogComponent implements OnInit, AfterViewInit {
  public settings: AppSettings;
  public rowNumber = 0;
  public maxItems = 0;
  public page = 0;
  public maxPage = 0;
  public containerPaddingTop: number;
  public column: number;
  public title: string;
  public dataDialog: DialogData;

  @ViewChild('content', { static: true }) elementView: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    public readonly appSettings: AppSettings,
    public readonly couponService: CouponService,
    private userservice: UserService
  ) {
    this.settings = appSettings;
    this.dataDialog = this.data;
    if (data.breakpoint < 6) {
      this.column = 2;
    } else if (data.breakpoint === 6) {
      this.column = 3;
    } else {
      this.column = 4;
    }
  }

  ngOnInit(): void {
    this.title = this.dataDialog.title;
    this.rowNumber = Math.floor((this.elementView.nativeElement.offsetHeight - 60) / 105);
    this.containerPaddingTop = Math.floor(((this.elementView.nativeElement.offsetHeight - 60) % 105) / 2);
    this.maxItems = this.rowNumber * this.column;
  }

  ngAfterViewInit(): void {
    timer(150).pipe(
      take(1)
    ).subscribe(() => {
        this.data.opened = true;
      });
  }
  close(): void {
    this.userservice.isBtnCalcEditable = true;
    this.dialogRef.close();
    this.userservice.isModalOpen = false;
    this.couponService.oddStakeEditSubject.next(null);
    this.data.opened = false;
  }
}
