import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeEs from '@angular/common/locales/es';
import localeFr from '@angular/common/locales/fr';
import localeHt from '@angular/common/locales/fr-HT';
import localeIt from '@angular/common/locales/it';
import localePt from '@angular/common/locales/pt';
import localeSq from '@angular/common/locales/sq';
import { LOCALE_ID, NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateUtilityService } from './translate-utility.service';
import { DynamicLocaleId } from './dynamic-locale-id';

registerLocaleData(localeIt);
registerLocaleData(localeFr);
registerLocaleData(localeEs);
registerLocaleData(localePt);
registerLocaleData(localeSq);
registerLocaleData(localeDe);
registerLocaleData(localeHt);
// tslint:disable-next-line:typedef
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    {
      provide: LOCALE_ID,
      deps: [TranslateUtilityService],
      useClass: DynamicLocaleId
    },
  ]
})
export class LanguageModule { }
