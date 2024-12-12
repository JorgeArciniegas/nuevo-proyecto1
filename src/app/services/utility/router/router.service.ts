import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { StorageService } from '../storage/storage.service';

// Interface to decoupling the router function and the device.
@Injectable({
  providedIn: 'root'
})
export class RouterService {
  productSameReload: boolean;
  constructor(private router: Router, private _location: Location, private storageService: StorageService) { }

  public getRouter(): Router {
    return this.router;
  }


  public getBack() {
    return this._location.back();
  }

  /**
   * Used for redirect to external brand site
   */
  public callBackToBrand() {
    const callBackURL = this.storageService.getData('callBackURL');
    if (callBackURL) {
      window.location.href = !callBackURL.includes('http')
        ? encodeURI('//' + callBackURL)
        : encodeURI(callBackURL);
    } else {
      this.router.navigateByUrl('error-page');
    }
  }

}
