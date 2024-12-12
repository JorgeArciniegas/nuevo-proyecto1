import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { TranslateUtilityService } from '../../../../shared/language/translate-utility.service';
import { fromEvent } from 'rxjs';
import { StatementVirtualShopService } from '../statement-virtual-shop.service';
import { RouterService } from '../../../../services/utility/router/router.service';


@Component({
  selector: 'app-statement-virtual-shop-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy {
  @ViewChild('pickerDateFrom') private inputPickerDateFrom;
  @ViewChild('pickerDateTo') private inputPickerDateTo;

  constructor(
    public service: StatementVirtualShopService,
    private translate: TranslateUtilityService,
    private adapter: DateAdapter<Date>,
    private router: RouterService
  ) {
    this.adapter.setLocale(this.translate.getCurrentLanguage());
    document.body.classList.add('bets-list');

    // close the date picker on outside click
    fromEvent(document, 'click').subscribe((event: any) => {
      const elem: any = event.target;
      let dismiss = true;
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

      if (this.inputPickerDateFrom && this.inputPickerDateFrom.opened && dismiss) {
        this.inputPickerDateFrom.close();
      }

      if (this.inputPickerDateTo && this.inputPickerDateTo.opened && dismiss) {
        this.inputPickerDateTo.close();
      }
    });
  }


  ngOnDestroy(): void {
    document.body.classList.remove('bets-list');
  }


  getData(): void {
    this.service.getData();
    this.router.getRouter().navigateByUrl('admin/reports/statement-vitual-shop/result');
  }
}
