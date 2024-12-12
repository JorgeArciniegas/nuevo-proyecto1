import { Component, HostListener, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MessageSource } from '@elys/elys-coupon';
import { Subscription, timer } from 'rxjs';
import { CouponDialogService } from '../component/coupon/coupon-dialog.service';
import { CouponService } from '../component/coupon/coupon.service';
import { UserService } from '../services/user.service';
import { WindowSizeService } from '../services/utility/window-size/window-size.service';
import { EventTime } from './main/main.models';
import { MainService } from './main/main.service';
import { DialogTypeCoupon } from './products.model';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements AfterViewInit, OnDestroy {
  observableMediaSubscribe: Subscription;
  public rowHeight: number;
  public messageSource: typeof MessageSource = MessageSource;
  dialogTypeCoupon: typeof DialogTypeCoupon = DialogTypeCoupon;

  /**
  * listen for tab focus changes and update event timer
  * */
  @HostListener('window:focus')
  onFocus(): void {
    if (this.mainService.eventDetails.events) {
      this.callRemainingEventTime();
    }
  }

  // Callback fire to onFocus event
  callRemainingEventTime() {
    this.mainService.remainingEventTime(
      this.mainService.eventDetails.events[this.mainService.eventDetails.currentEvent].number)
      .then((eventTime: EventTime) => {
        if (eventTime) {
          if (eventTime.minute <= 0 && eventTime.second <= 0) {
            this.mainService.currentAndSelectedEventTime();
          } else {
            this.mainService.eventDetails.eventTime = eventTime;
            if (this.mainService.eventDetails.currentEvent === 0) {
              this.mainService.remainingTime.minute = eventTime.minute;
              this.mainService.remainingTime.second = eventTime.second;
            }
          }
        }
      });
  }
  constructor(
    private observableMedia: MediaObserver,
    public service: ProductsService,
    public mainService: MainService,
    public readonly userService: UserService,
    public readonly couponService: CouponService,
    public readonly couponDialogService: CouponDialogService,
    public windowSizeService: WindowSizeService,
    private cdr: ChangeDetectorRef
  ) {
    this.observableMediaSubscribe = this.observableMedia.media$.subscribe((change: MediaChange) => {
      this.service.breakpoint = this.service.gridByBreakpoint[change.mqAlias];
      // this.windowSizeService.initWindowSize();

      this.rowHeight = (this.windowSizeService.windowSize.columnHeight - 30) / 12;
    });
  }

  ngAfterViewInit() {
    //this.windowSizeService.initWindowSize();
    if (!this.service.product) {
      
      timer(1).subscribe(() => {
        this.service.checkDefaultProduct();
        this.cdr.detectChanges();
      });
    }
  }

  ngOnDestroy(): void {
    this.observableMediaSubscribe.unsubscribe();
  }

  payCancelCoupon(type): void {
    this.changeClassApp('modal-center');
    this.couponDialogService.openPayCancelDialog(type);
    this.couponDialogService.dialogRef.afterClosed().subscribe(evt => {
      this.changeClassApp('modal-center');
    });
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
