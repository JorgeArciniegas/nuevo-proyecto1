import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Language } from './language.model';
import { TranslateUtilityService } from '../../../shared/language/translate-utility.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {
  languages: string[];
  languageEnum: typeof Language = Language;
  // String for the generation of rows on NativeScript template
  rowsDefinition: string;

  constructor(
    private appSettings: AppSettings,
    private translateService: TranslateUtilityService
  ) {
    this.languages = appSettings.supportedLang;
  }

  ngOnInit() {
    this.rowsDefinition = this.genRows();
  }

  changeLanguage(lang: string) {
    this.translateService.changeLanguage(lang);
  }

  // Method to determin the number of rows to show on the NativeScript template.
  genRows(): string {
    // Get the number of languages to show.
    const langNum = this.languages.length;
    // Calculate the number of rows are needed to show the language on a template of two columns.
    const rowsNum = Math.ceil(langNum / 2);
    // Create the string to use on the template.
    let templateString = '*';
    for (let i = 1; i < rowsNum; i++) {
      templateString += ',*';
    }
    return templateString;
  }
}
