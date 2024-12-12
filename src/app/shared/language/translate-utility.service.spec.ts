import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ElysStorageLibService } from "@elys/elys-storage-lib";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { AppSettings } from "src/app/app.settings";
import { ElysStorageLibServiceStub } from "src/app/mock/stubs/elys-storage.stub";
import { StorageService } from "src/app/services/utility/storage/storage.service";
import { getLanguages, LANGUAGES } from "./language.models";
import { HttpLoaderFactory } from "./language.module";
import { TranslateUtilityService } from "./translate-utility.service";

const translation: object = {
  "CLOSING": "Chiusura"
}

function translateIt(key: string, params?: any): Observable<string> {
  return of(translation[key]);
}

describe('TranslateUtilityService', () => {
  let service: TranslateUtilityService;
  let translateService: TranslateService;
  let storageService: StorageService;
  let appSettings: AppSettings;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      providers: [
        TranslateUtilityService,
        TranslateService,
        StorageService,
        { provide: ElysStorageLibService, useClass: ElysStorageLibServiceStub },
        AppSettings
      ],
    });

    service = TestBed.inject(TranslateUtilityService);
    translateService = TestBed.inject(TranslateService);
    storageService = TestBed.inject(StorageService);
    appSettings = TestBed.inject(AppSettings);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set browser language', () => {
    storageService.removeItems('lang');
    const browserLanguage: string = 'en';

    service.initializeLanguages(browserLanguage);
    expect(service.getCurrentLanguage()).toEqual(browserLanguage);
  });

  it('should set default language', () => {
    storageService.removeItems('lang');
    const browserLanguage: string = 'uk';
    const expectedLanguage: string = appSettings.supportedLang[0];

    service.initializeLanguages(browserLanguage);
    expect(service.getCurrentLanguage()).toEqual(expectedLanguage);
  });

  it('should set stored language', () => {
    const storedLanguage: string = 'it';
    const browserLanguage: string = 'en';
    storageService.setData('lang', storedLanguage);

    service.initializeLanguages(browserLanguage);
    expect(service.getCurrentLanguage()).toEqual(storedLanguage);
  });

  it('should set default when stored language is not supported', () => {
    const storedLanguage: string = 'uk';
    const browserLanguage: string = 'it';
    const expectedLanguage: string = appSettings.supportedLang[0];

    storageService.setData('lang', storedLanguage);

    service.initializeLanguages(browserLanguage);
    expect(service.getCurrentLanguage()).toEqual(expectedLanguage);
  });

  it('should change language', () => {
    const language: string = 'en';

    spyOn(translateService, 'use');
    service.changeLanguage(language);

    expect(translateService.use).toHaveBeenCalledWith(language);
    expect(storageService.getData('lang')).toEqual(language);
  });

  it('should change language on default', () => {
    const language: string = 'uk';
    const expectedLanguage: string = getLanguages(LANGUAGES[appSettings.supportedLang[0]], true)

    spyOn(translateService, 'use');
    service.changeLanguage(language);

    expect(translateService.use).toHaveBeenCalledWith(expectedLanguage);
    expect(storageService.getData('lang')).toEqual(language);
  });

  it('should return current language', () => {
    const language: string = 'it';

    service.changeLanguage(language);
    expect(service.getCurrentLanguage()).toEqual(language);
  });

  it('should asynchronously translate string', async() => {
    const translationKey: string = 'CLOSING';
    const translatedValue: string = translation[translationKey];

    const language: string = 'it';
    service.changeLanguage(language);
    spyOn(translateService, 'get').and.callFake(translateIt);

    const result = await service.getTranslatedStringAsync(translationKey);

    expect(translateService.get).toHaveBeenCalledWith(translationKey);
    expect(result).toEqual(translatedValue);
  });

  it('should translate string', () => {
    const translationKey: string = 'CLOSING';
    const translatedValue: string = translation[translationKey];

    const language: string = 'it';
    service.changeLanguage(language);
    spyOn(translateService, 'get').and.callFake(translateIt);

    const result = service.getTranslatedString(translationKey);

    expect(result).toEqual(translatedValue);
  });

  it('should asynchronously translate string with params', async() => {
    const translationKey: string = 'CLOSING';
    const translatedValue: string = translation[translationKey];
    const params: any = { name: 'some parameter' };

    const language: string = 'it';
    service.changeLanguage(language);
    spyOn(translateService, 'get').and.callFake(translateIt);

    const result = await service.getTranslatedStringWithParamsAsync(translationKey, params);

    expect(translateService.get).toHaveBeenCalledWith(translationKey, params);
    expect(result).toEqual(translatedValue);
  });

  it('should translate string with params', () => {
    const translationKey: string = 'CLOSING';
    const translatedValue: string = translation[translationKey];
    const params: any = { name: 'some parameter' };

    const language: string = 'it';
    service.changeLanguage(language);
    spyOn(translateService, 'get').and.callFake(translateIt);

    const result = service.getTranslatedStringWithParams(translationKey, params);

    expect(result).toEqual(translatedValue, params);
  });
});
