import { Injectable } from '@angular/core';
import { getLanguages, LANGUAGES } from './language.models';
import { TranslateUtilityService } from './translate-utility.service';

@Injectable({
  providedIn: 'root'
})
export class DynamicLocaleId extends String {
  constructor(private service: TranslateUtilityService) {
    super();
  }

  toString(): string {
    return getLanguages(LANGUAGES[this.service.getCurrentLanguage()]);
  }
}
