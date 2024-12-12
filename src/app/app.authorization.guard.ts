import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
} from '@angular/router';
import { RouterService } from './services/utility/router/router.service';
import { UserService } from './services/user.service';
import { StorageService } from './services/utility/storage/storage.service';
import { TYPE_ACCOUNT, LOGIN_TYPE, LoginDataDirect } from './services/user.models';
import { AppSettings } from './app.settings';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: RouterService,
    private userService: UserService,
    private storageService: StorageService,
    private appSetting: AppSettings
  ) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    next: RouterStateSnapshot
  ): Promise<boolean> {
    try {
      // When router path is "login"
      if (route.url[0].path.includes('login')) {
        // check if the login
        if (!this.appSetting.loginInteractive) {
          this.router.getRouter().navigateByUrl('/error-page');
          return false;
        }
        // The user is already logged
        if (this.userService.isUserLogged) {
          this.router.getRouter().navigateByUrl('/products');
          return false;
        } else {
          return true;
        }
        // login without interactive
      } else if (route.url[0].path.includes('extclient')) {
        try {
          const request: LoginDataDirect = {
            loginType: LOGIN_TYPE[route.paramMap.get('loginType').toUpperCase()],
            token: route.paramMap.get('token'),
            language: route.paramMap.get('language') ? route.paramMap.get('language') : this.appSetting.supportedLang[0]
          };
          this.storageService.setData('callBackURL', route.paramMap.get('homeURL'));
          if (await this.userService.loginWithoutInteractive(request)) {
            this.router.getRouter().navigateByUrl('/products');
          } else {
            this.router.callBackToBrand();
            return true;
          }
        } catch (err) {
          return false;
        }
      }

      this.userService.targetedUrlBeforeLogin = next.url.toString();
      // For all the other routes
      if (this.userService.isUserLogged) {
        // If the AccountDetails for any reason is not available.
        if (!this.storageService.checkIfExist('UserData')) {
          await this.userService.loadUserData(
            this.storageService.getData('tokenData')
          );
        }
        return true;
      } else {
        this.router.getRouter().navigateByUrl('/login');
        return false;
      }
    } catch (err) {
      this.router.getRouter().navigateByUrl('/error-page');
      return false;
    }
  }

  /**
   * Authorization children routes
   * @param childRoute
   * @param state
   */
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let r = false;
    try {
      // check if the route has a restriction
      if (childRoute.data.expectedRole.includes(TYPE_ACCOUNT.OPERATOR) &&
        this.userService.isLoggedOperator() || childRoute.data.expectedRole.includes(TYPE_ACCOUNT.ADMIN) &&
        !this.userService.isLoggedOperator()) {
        r = true;
      }
    } catch (err) {
      r = false;
    } finally {

      if (!r) {
        this.router.getRouter().navigateByUrl('/error-page');
      }

      return r;
    }


  }
}
