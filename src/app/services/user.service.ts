import { Injectable } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { CurrencyCodeRequest, CurrencyCodeResponse, ElysApiService, StagedCouponStatus, TokenDataSuccess, UserPolicies, UserType, CouponLimit } from '@elys/elys-api';
import { ElysCouponService } from '@elys/elys-coupon';
import { Subscription, timer } from 'rxjs';
import { Products } from '../../environments/environment.models';
import { AppSettings } from '../app.settings';
import { DataUser, LoginDataDirect, LOGIN_TYPE, OperatorData } from './user.models';
import { RouterService } from './utility/router/router.service';
import { StorageService } from './utility/storage/storage.service';
import { TranslateUtilityService } from '../shared/language/translate-utility.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _dataUserDetail: DataUser;
  private loadDataPool: Subscription;
  public get dataUserDetail(): DataUser {
    if (!this._dataUserDetail) {
      this.dataUserDetail = {
        userDetail: null,
        operatorDetail: null,
        productIsLoaded: false,
        couponLimit: null
      };
    }
    return this._dataUserDetail;
  }

  public set dataUserDetail(value: DataUser) {
    this._dataUserDetail = value;
  }



  // URL to which was navigating before to be stopped by the authorization guard.
  public targetedUrlBeforeLogin: string;
  public isModalOpen = false;
  public isBtnCalcEditable = true;
  public userCurrency: string;
  private isInitUser = true;
  public get policy(): UserPolicies {
    if (!this.dataUserDetail.userDetail && !this.dataUserDetail.operatorDetail) {
      return;
    }
    return this.dataUserDetail.userDetail !== null ?
      this.dataUserDetail.userDetail.UserPolicies
      : this.dataUserDetail.operatorDetail.UserPolicies;
  }

  private productsDefault: Products[];

  get limitUser(): CouponLimit {
    return this.dataUserDetail.couponLimit
      ? this.dataUserDetail.couponLimit
      : undefined;
  }

  constructor(
    private router: RouterService,
    private storageService: StorageService,
    private translateService: TranslateUtilityService,
    private api: ElysApiService,
    private appSetting: AppSettings,
    private elysCouponService: ElysCouponService
  ) {
    this.userCurrency = appSetting.currencyDefault;
    // Check if the user is logged
    this.checkLoginData();

    /**
     * listening for staged coupons variation then check the status, if = Placed substracts the played stake from playable balance
     */
    this.elysCouponService.stagedCouponObs.subscribe(coupons => {
      for (const coupon of coupons.filter(
        item => item.CouponStatusId === StagedCouponStatus.Placed
      )) {
        if (this.isLoggedOperator()) {
          this.decreasePlayableBalance(coupon.Stake);
        }
      }
    });
  }

  /**
   * check login data
   */
  checkLoginData(bootStartMsec: number = 0): void {
    if (this.isUserLogged) {
      this.loadDataPool = timer(bootStartMsec, 300000).subscribe(() => {
        if (this.isUserLogged) {
          this.loadUserData(this.storageService.getData('tokenData'), this.isLoggedOperator());
        }
      });
      this.api.tokenBearer = this.storageService.getData('tokenData');
    }
  }

  /**
   * Method to login and store auth token.
   * @param username username
   * @param password password
   */
  async login(username: string, password: string): Promise<string | undefined> {
    try {
      const response: TokenDataSuccess = await this.api.account.postAccessToken(
        { username, password }
      );

      const userDataResponse = await this.loadUserData(response.access_token, true);
      // Check that we have gotten the user data.
      if (this.dataUserDetail && this.dataUserDetail.userDetail) {
        /* If there is a previous Url which is different then the admin area.
          To avoid to go back to the menu where the user had gone just to do the "logout" or to the lists that wouldn't miss the data. */
        if (
          this.targetedUrlBeforeLogin &&
          !this.targetedUrlBeforeLogin.includes('/admin')
        ) {
          this.router.getRouter().navigateByUrl(this.targetedUrlBeforeLogin);
        } else {
          this.router.getRouter().navigateByUrl('/products');
        }
      } else {
        return userDataResponse;
      }
    } catch (err) {
      console.log(err);
      //Check if error description exsists, if so, check for trailing dot and remove it
      //Login and login operator error messages responses have same messages but different trailing dots
      let errDesc: string = err && err.error_description ? err.error_description : '';
      return errDesc.length > 0 ?
      'LOGIN_MESSAGES.' + this.removeTrailingDot(errDesc) :
      err.error;
    }
  }
  /**
   * Different method for user login. It used by authenticate the operator after admin login
   * @param Username
   * @param Password
   */
  async loginOperator(Username: string, Password: string): Promise<string | undefined> {
    try {
      const UserId = this.getOperatorData('ClientId');
      const response: TokenDataSuccess = await this.api.account.clientLoginRequest(
        { Username, Password, UserId }
      );
      const userDataResponse = await this.loadUserData(response.access_token, false);

      // Check that we have gotten the user data.
      if (this.dataUserDetail.operatorDetail) {
        /* If there is a previous Url which is different then the admin area.
          To avoid to go back to the menu where the user had gone just to do the "logout" or to the lists that wouldn't miss the data. */
        if (
          this.targetedUrlBeforeLogin &&
          !this.targetedUrlBeforeLogin.includes('/admin')
        ) {
          this.router.getRouter().navigateByUrl(this.targetedUrlBeforeLogin);
        } else {
          this.router.getRouter().navigateByUrl('/products');
        }
      } else {
        return userDataResponse;
      }
    } catch (err) {
      console.log(err);
      //Check if error description exsists, if so, check for trailing dot and remove it
      //Login and login operator error messages responses have same messages but different trailing dots
      let errDesc: string = err && err.error_description ? err.error_description : '';
      return errDesc.length > 0 ?
      'LOGIN_MESSAGES.' + this.removeTrailingDot(errDesc) :
      err.error;
    }
  }

  /**
   *
   * @param message string where remove trailing dot
   * @returns string without trailing dot
   */
  removeTrailingDot(message: string): string{
    return message.slice( -1 ) === '.' ? message.slice( 0, -1 ) : message;
  }

  /**
   * Method for login from url Without interactive mode
   * @param request
   */
  async loginWithoutInteractive(request: LoginDataDirect): Promise<boolean> {
    try {
      const isAdmin = request.loginType === LOGIN_TYPE.WEB || request.loginType === LOGIN_TYPE.OPERATOR ? false : true;
      await this.loadUserData(request.token, isAdmin);
      // Check that we have gotten the user data.
      if (this.dataUserDetail.operatorDetail && !isAdmin || this.dataUserDetail.userDetail && isAdmin) {
        this.translateService.changeLanguage(request.language);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log('ERRROR loginWithoutInteractive --->', err);
      return false;
    }
  }

  logout(): void {
    this.dataUserDetail = undefined;
    // Clear the storage's data and the token from vgen.service
    // this.api.removeToken();
    this.storageService.removeItems('tokenData', 'UserData');
    this.api.tokenBearer = null;
    this.isInitUser = true;
    if (this.loadDataPool) {
      this.loadDataPool.unsubscribe();
    }
    if (this.appSetting.loginInteractive) {
      this.router.getRouter().navigateByUrl('/login');
    } else {
      this.router.callBackToBrand();
    }

  }
  /**
   * Decrease the played stake from Playable amount
   * @param stake :number
   */
  decreasePlayableBalance(stake: number): void {
    this.dataUserDetail.userDetail.PlayableBalance -= stake;
  }

  /**
 * Increase the played stake from Playable amount
 * @param stake :number
 */
  increasePlayableBalance(stake: number): void {
    if (this.dataUserDetail.userDetail) {
      this.dataUserDetail.userDetail.PlayableBalance += stake;
    }
  }


  // Method to retrieve the user data
  async loadUserData(token: string, loginAdmin?: Boolean): Promise<string | undefined> {
    let isAdmin: boolean;
    try {
      if (
        (loginAdmin === null || loginAdmin === undefined) &&
        (this.isLoggedOperator() !== undefined || this.isLoggedOperator() !== null)
      ) {
        loginAdmin = this.isLoggedOperator();
      }
      this.setToken(token);
      // check if user is the operator or admin
      if (
        !loginAdmin
      ) {
        this.dataUserDetail.operatorDetail = await this.api.account.getOperatorMe();
        isAdmin = false;
        if (this.dataUserDetail.operatorDetail.UserType as number === 0) {
          await this.api.account.getMe().then(user => this.dataUserDetail.operatorDetail.UserType = user.UserType);
        }
      } else if (loginAdmin || !this.isAdminExist() || (this.isLoggedOperator() === null || this.isLoggedOperator())) {
        this.dataUserDetail.userDetail = await this.api.account.getMe();
        isAdmin = true;
      } else {
        this.dataUserDetail.operatorDetail = await this.api.account.getOperatorMe();

        isAdmin = false;
      }
      // Save the data only if the user is a valid user.
      if (this.isAValidUser()) {
        if (this.dataUserDetail.userDetail &&
          this.dataUserDetail.userDetail.UserType === UserType.Ced
        ) {

          this.setOperatorData({
            clientId: this.dataUserDetail.userDetail.UserId,
            businessName: this.dataUserDetail.userDetail.FirstName + ' - ' + this.dataUserDetail.userDetail.LastName,
            adminLogged: isAdmin
          }
          );

        } else {
          this.setOperatorData({ adminLogged: isAdmin });
        }

        this.storageService.setData('UserData', this.dataUserDetail);


        try {
          this.userCurrency = this.dataUserDetail.userDetail ?
            this.dataUserDetail.userDetail.Currency :
            this.dataUserDetail.operatorDetail.CurrencyCode;
        } catch (err) {
          console.log(err);
        }
      } else {
        this.storageService.removeItems('tokenData');
        this.dataUserDetail = undefined;
        this.api.tokenBearer = undefined;
        return this.translateService.getTranslatedString(
          'USER_NOT_ENABLE_TO_THE_OPERATION'
        );
      }
      if (this.isInitUser) {
        this.getlimitsData();
        await this.checkAvailableSportAndSetPresetsAmount();
        this.isInitUser = false;
      }

      // check if timer for data login is enabled
      if (this.loadDataPool && this.loadDataPool.closed) {
        this.checkLoginData(0);
      }

    } catch (err) {
      if (err.status === 401) {
        // if unauthorized call logout
        this.logout();
      }
      console.log(err);
      return err.error.Message;
    }
  }


  getlimitsData(): void {
    const currency: number = this.isLoggedOperator()
      ? this.dataUserDetail.userDetail.UserCurrency.CurrencyId
      : this.dataUserDetail.operatorDetail.UserCurrency.CurrencyId;
    const userType: UserType = this.isLoggedOperator()
      ? this.dataUserDetail.userDetail.UserType
      : this.dataUserDetail.operatorDetail.UserType;


    this.api.coupon.getCouponLimits({ CurrencyId: currency }).then(response => {
      const limit = response.find(l => l.Product === 'V' && l.UserType === userType);
      if (limit) {
        this.dataUserDetail.couponLimit = limit.CouponLimit;
        this.storageService.setData('UserData', this.dataUserDetail);
      }
    }).catch(err => console.log(err));

  }

  // Method to check if a user is currently logged.
  get isUserLogged(): boolean {
    return this.storageService.checkIfExist('tokenData');
  }

  // Method to set the token on the vgen.service and to save it on the storage as well.
  private setToken(token: string): void {
    // Put on API LIB the token bearer
    this.api.tokenBearer = token;
    this.storageService.setData('tokenData', token);
  }

  // Method to remove the token from the vgen.service and the storage as well.
  private removeToken(): void {
    this.api.tokenBearer = null;
    this.storageService.removeItems('tokenData');
    this.api.tokenBearer = undefined;
  }

  // Method to check if the user can log into the system. Only CTD user are allowed.
  private isAValidUser(): boolean {
    let r: boolean;
    if (this.dataUserDetail.userDetail) { // if the user is admin
      if (
        this.dataUserDetail.userDetail.UserPolicies.CanCreateEndUserChildren === false &&
        this.dataUserDetail.userDetail.UserPolicies.CanHaveChildren === false &&
        this.dataUserDetail.userDetail.UserPolicies.CanHaveCommissions === true &&
        this.dataUserDetail.userDetail.UserPolicies.CanPlayVirtualGenerationsByItself === true) {
        r = true;
      } else {
        r = false;
      }
    } else if (this.dataUserDetail.operatorDetail) { // if the user is operator
      if (
        this.dataUserDetail.operatorDetail.UserPolicies.CanCreateEndUserChildren === false &&
        this.dataUserDetail.operatorDetail.UserPolicies.CanHaveChildren === false &&
        this.dataUserDetail.operatorDetail.UserPolicies.CanHaveCommissions === true &&
        this.dataUserDetail.operatorDetail.UserPolicies.CanPlayVirtualGenerationsByItself === true
      ) {
        r = true;
      } else {
        r = false;
      }
    }
    return r;
  }


  /**
   * Setting the real playble game
   * It sets 'defaultAmount' on products from 'CouponPresetValues'.
   * If the game is present on the 'environment' but it doesn't match the 'availableSport',
   * it isn't playable and it is only shown in the reports list.
   */
  async checkAvailableSportAndSetPresetsAmount(): Promise<void> {
    // Set  'defaultAmount'  the "presets value"
    this.getDefaultPreset().then(preset => {
      if (preset.CouponPreset !== null) {
        this.appSetting.defaultAmount = preset.CouponPreset.CouponPresetValues;
      }
    });

    // check if the productsDefault
    if (!this.productsDefault) {
      this.productsDefault = this.appSetting.products;
    } else {
      this.appSetting.products = this.productsDefault;
    }
    const userPolicies = this.getAuthorization();
    // match products result from api to products on the system
    this.api.virtual.getAvailablevirtualsports().then(items => {
      this.appSetting.products.forEach(product => {
        if (!items.map(x => x.SportId).includes(product.sportId)) {
          product.productSelected = false;
          product.isPlayable = false;
        }
      });
    });

    // filter product by sportId enabled to user policies
    let authorizedVirtualSports: number[] = [];
    if (this.dataUserDetail.userDetail) {
      authorizedVirtualSports = this.dataUserDetail.userDetail.UserPolicies.AuthorizedVirtualSports;
    } else {
      authorizedVirtualSports = this.dataUserDetail.operatorDetail.UserPolicies.AuthorizedVirtualSports;
    }
    this.appSetting.products.forEach(product => {
      if (!authorizedVirtualSports.includes(product.sportId)) {
        product.productSelected = false;
        product.isPlayable = false;
      }
    }
    );

    // filter product by categoryId enabled for user policies
    let authorizedVirtualCategories: string[] = [];
    if (this.dataUserDetail.userDetail) {
      authorizedVirtualCategories = this.dataUserDetail.userDetail.UserPolicies.AuthorizedVirtualCategories;
    } else {
      authorizedVirtualCategories = this.dataUserDetail.operatorDetail.UserPolicies.AuthorizedVirtualCategories;
    }
    this.appSetting.products.map(product => {
      if (!authorizedVirtualCategories.includes(product.codeProduct)) {
        product.productSelected = false;
        product.isPlayable = false;
      }
    }
    );

    // show the products from app-menu
    this.dataUserDetail.productIsLoaded = true;
  }

  //
  getDefaultPreset(): Promise<CurrencyCodeResponse> {
    const currencyRequest: CurrencyCodeRequest = {
      currencyCode: this.userCurrency
    };
    return this.api.coupon.getCouponRelatedCurrency(currencyRequest);
  }

  /**
   *
   */
  isAdminExist(): boolean {
    return this.storageService.checkIfExist('operatorData');
  }

  /**
   *
   */
  isLoggedOperator(): boolean {
    return this.getOperatorData('isAdminLogged');
  }
  /**
   *
   * @param key is the parameter to find on the object saved to storage
   */
  getOperatorData(key: string) {
    return this.storageService.getData('operatorData') && this.storageService.getData('operatorData')[key];
  }

  /**
   *
   * @param req
   */
  setOperatorData(req: { clientId?: number, businessName?: string, adminLogged?: boolean }): void {
    const operator: OperatorData = {
      ClientId: req.clientId !== undefined ? req.clientId : this.getOperatorData('ClientId'),
      BusinessName: req.businessName !== undefined ? req.businessName : this.getOperatorData('BusinessName'),
      isAdminLogged: req.adminLogged !== undefined ? req.adminLogged : this.getOperatorData('isAdminLogged')
    };
    this.storageService.setData('operatorData', operator);
  }

  /**
   * Delete admin data from storage
   */
  removeDataCtd() {
    this.storageService.removeItems('operatorData');
  }


  getUserId() {
    return this.isLoggedOperator() ?
      this.storageService.getData('UserData').userDetail.UserId : this.getOperatorData('ClientId');
  }


  getAuthorization(): UserPolicies {
    return this.dataUserDetail.userDetail ? this.dataUserDetail.userDetail.UserPolicies : this.dataUserDetail.operatorDetail.UserPolicies;
  }

}
