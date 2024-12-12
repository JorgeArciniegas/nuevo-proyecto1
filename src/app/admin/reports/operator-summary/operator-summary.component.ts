import { Component, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { OperatorSummaryService } from './operator-summary.service';
import { fromEvent } from 'rxjs';
import { TranslateUtilityService } from '../../../shared/language/translate-utility.service';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-operator-summary',
  templateUrl: './operator-summary.component.html',
  styleUrls: ['./operator-summary.component.scss']
})
export class OperatorSummaryComponent implements AfterViewInit, OnDestroy {
  @ViewChild('pickerDateFrom') private inputPickerDateFrom;
  @ViewChild('pickerDateTo') private inputPickerDateTo;

  constructor(public operatorSummaryService: OperatorSummaryService,
    private translate: TranslateUtilityService, private adapter: DateAdapter<Date>) {
    this.adapter.setLocale(this.translate.getCurrentLanguage());

    document.body.classList.add('operator-summary');

  }

  ngAfterViewInit() {

    // close the date picker on outside click
    fromEvent(document, 'click').subscribe((event: any) => {
      const elem: any = event.target;
      let dismiss = true;
      if (event.path) {

        event.path.forEach(htmlElem => {
          if (!htmlElem.classList) {
            return;
          }
          htmlElem.classList.forEach(item => {
            if (/mat-dialog.*/.test(item) || /mat-calendar*/.test(item) || /datepicker*/.test(item)) {
              dismiss = false;
            }
          });
        });
      }

      if (this.inputPickerDateFrom.opened && dismiss) {
        this.inputPickerDateFrom.close();
      }

      if (this.inputPickerDateTo.opened && dismiss) {
        this.inputPickerDateTo.close();
      }
    });
  }
  ngOnDestroy(): void {
    document.body.classList.remove('operator-summary');
  }

}
