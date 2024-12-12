import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { getLanguages, LANGUAGES } from './language.models';
import { AppSettings } from '../../app.settings';
import { StorageService } from '../../services/utility/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class TranslateUtilityService {
  private currentLanguage: string;

  constructor(
    private readonly appSettings: AppSettings,
    private translateService: TranslateService,
    private storageService: StorageService
  ) {
    this.translateService.onLangChange.subscribe(() => {
      this.currentLanguage = this.translateService.currentLang;
    });
  }

  /**
   * Method to inizialize the list of the application's languages, set the default language and the used one.
   * The "TranslateService.DefaultLanguage" is the default language to use as a fallback
   * in case of a missing key in the dictionary of the language in use.
   */
  public initializeLanguages(browserLang: string): void {
    this.translateService.addLangs(this.appSettings.supportedLang);
    // Set the default language only in the case the company is set in production mode
    if (this.appSettings.production) {
      this.translateService.setDefaultLang(this.appSettings.supportedLang[0]);
    }
    // Selection language's logic.
    // Check if there is any setting on the localStorage.
    if (this.storageService.checkIfExist('lang')) {
      const storedLang = this.storageService.getData('lang');
      // Check if it is a supported language.
      if (this.appSettings.supportedLang.findIndex(lang => lang === storedLang) !== -1) {
        // Set as the language to be used.
        this.currentLanguage = storedLang;
      } else {
        // Set the default language which is the first element of the "supportedLang" array.
        this.currentLanguage = this.appSettings.supportedLang[0];
        // Remove the invalid language from the storage.
        this.storageService.removeItems('lang');
      }
    } else {
      /* Use the language of the browser/device if it is supported.
         Otherwise, the default language (first element of the "supportedLang" array) will be used. */
      this.currentLanguage =
        this.appSettings.supportedLang.findIndex(lang => lang === browserLang) !== -1 ? browserLang : this.appSettings.supportedLang[0];
    }
    // Set the language to use according to the value of the variable.
    this.translateService.use(this.currentLanguage);
  }
  
  /**
   * Switch the curent app language
   * @param lang - selected language
   */
  public changeLanguage(lang: string): void {
    if (this.appSettings.supportedLang.includes(lang)) {
      this.currentLanguage = LANGUAGES[lang];
      this.translateService.use(getLanguages(LANGUAGES[lang], true));
    } else {
      // If selected language is not supported select the first
      this.translateService.use(getLanguages(LANGUAGES[this.appSettings.supportedLang[0]], true));
    }
    this.storageService.setData('lang', lang);

  }

  public getCurrentLanguage(): string {
    return this.translateService.currentLang;
  }

  public async getTranslatedStringAsync(value: string): Promise<string> {
    return this.translateService.get(value).toPromise();
  }

  public getTranslatedString(value: string): string {
    let result: string;

    this.translateService.get(value).subscribe((res: string) => {
      result = res;
    });

    return result;
  }

  public getTranslatedStringWithParams(value: string, params: object): string {
    let result: string;

    this.translateService.get(value, params).subscribe((res: string) => {
      result = res;
    });

    return result;
  }

  public async getTranslatedStringWithParamsAsync(value: string, params: object): Promise<string> {
    return this.translateService.get(value, params).toPromise();
  }
}
