import { Observable, Subject } from 'rxjs';
import { Products } from '../../environments/environment.models';
import { DestroyCouponService } from '../component/coupon/confirm-destroy-coupon/destroy-coupon.service';
import { CouponService } from '../component/coupon/coupon.service';
import { RouterService } from '../services/utility/router/router.service';
export class ProductsServiceExtra {

  public productNameSelectedSubscribe: Subject<string>;
  public productNameSelectedObserve: Observable<string>;

  // product selected
  product: Products;
  productSameReload: boolean;
  constructor(
    public couponInternalService: CouponService,
    public destroyCouponService: DestroyCouponService,
    public router: RouterService) { }

  /**
  *
  * @param codeProduct
  **/
  changeProduct(codeProduct: string): void {

    // Check if the productCode is equal to the current one. if it isn't, mark it as to destroy.
    if (this.product && codeProduct === this.product.codeProduct) {
      this.productNameSelectedSubscribe.next(codeProduct);
      this.router.getRouter().navigate(['/products/main']);
    } else {
      // check if the product has a temporary coupon
      this.couponInternalService.checkHasCoupon();
      // opening the confirm destroy coupon process
      if (
        this.couponInternalService.productHasCoupon.checked &&
        (this.couponInternalService.coupon &&
          this.couponInternalService.coupon.Odds.length > 0)) {
        // update productCode request for check on the other service
        this.couponInternalService.productHasCoupon.productCodeRequest = codeProduct;
        // open modal destroy confirm coupon
        this.destroyCouponService.openDestroyCouponDialog();
        // subscribe to event dialog
        this.destroyCouponService.dialogRef.afterClosed().subscribe(elem => {
          if (elem) {
            this.productNameSelectedSubscribe.next(codeProduct);
            this.router.getRouter().navigate(['/products/main']);
          }
        });
      } else { // the coupon is empty
        this.productNameSelectedSubscribe.next(codeProduct);
        this.router.getRouter().navigate(['/products/main']);
      }
    }

  }
}
