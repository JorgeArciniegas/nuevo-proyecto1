import { Injectable } from '@angular/core';
import { StagedCouponDetail, StagedCouponStatus, SummaryCoupon } from '@elys/elys-api';
import { ElysCouponService } from '@elys/elys-coupon';
import { BehaviorSubject, timer } from 'rxjs';
import { take,takeWhile} from 'rxjs/operators'
import { RouterService } from '../../../services/utility/router/router.service';

@Injectable({
  providedIn: 'root'
})
/**
 * PrintCouponService is only for DESKTOP version
 * To not use on NativeScript Application
 */
export class PrintCouponService {
  printingEnabled: boolean;
  couponPrint: StagedCouponDetail;
  isPrintAgainst: boolean;
  reprintDate: Date;
  private printActive: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(elysCoupon: ElysCouponService, private router: RouterService) {
    // subscribe to stagedCouponObs and it is found on  "coupon library".
    // It returns the StagedCouponDetail's array
    // Check the status which list is provided in the enum "StagedCouponStatus".
    elysCoupon.stagedCouponObs.subscribe(async coupons => {
      // for results returned filter the item by "CouponStatusId = Placed"  and enable the print
      for (const coupon of coupons.filter(item => item.CouponStatusId === StagedCouponStatus.Placed)) {
        this.printingEnabled = true;
        this.couponPrint = coupon;
        // Start the print process
        this.printWindow();
      }
    });

    this.printActive.asObservable().subscribe(isActive =>{
      if(!isActive){
         // reset the router AND DISABLE PRINT
        timer(1000).subscribe(
          ()=>{
            this.router.getRouter().navigate([{ outlets: { print: null } }]).then(()=>{
              this.isPrintAgainst = false;
              this.printingEnabled = false;
              this.couponPrint = null;
              document.getElementById('app').classList.remove('isPrinting');
              this.router.getRouter().navigate([{ outlets: { print: null } }]);
            }); 
          }
        )
      }
    })
  }
  reprintCoupon(coupon: SummaryCoupon) {
    this.couponPrint = (coupon as unknown) as StagedCouponDetail;
    this.isPrintAgainst = true;
    this.reprintDate = new Date();
    this.printWindow();
  }
  /**
   * It Opens the new route on outlet with name=print and append to the Dom element the class "isPrinting"
   * Please do not change it because the style of prints is set on it
   */
  printWindow(): void {
    
    this.checkProduct();
    this.printingEnabled = true;
    this.router.getRouter().navigate(['/', { outlets: { print: 'print-coupon' } }]);
    document.getElementById('app').classList.add('isPrinting');
    this.printActive.next(true);

    timer(250).pipe(
      take(1),
      takeWhile(() => this.printingEnabled)
      ).subscribe( async(valtimer) => {
      await window.print();
      this.printActive.next(false);
    });
 
  }

  resetPrint(): void { }

  /**
   * This function define the different product
   */
  checkProduct(): void {
    if (this.couponPrint.Odds[0].SportName.indexOf('Keno') > -1 || this.couponPrint.Odds[0].SportName.indexOf('Colors') > -1) {
      this.couponPrint.Product = 'NUMBERS';
    } else if (this.couponPrint.Odds[0].SportName.indexOf('Roulette') !== -1) {
      this.couponPrint.Product = 'ROULETTE';
    } else {
      this.couponPrint.Product = 'VIRT';
    }
  }
}
