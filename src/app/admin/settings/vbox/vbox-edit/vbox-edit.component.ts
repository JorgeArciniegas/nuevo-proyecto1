import { Component, OnInit, OnDestroy } from '@angular/core';
import { VboxService } from '../vbox.service';
import { Language } from '../../language/language.model';
import { AppSettings } from '../../../../app.settings';
import { VBoxMonitorConfiguration, VBoxAvailableCategoryType, ErrorStatus } from '@elys/elys-api';
import { RouterService } from '../../../../services/utility/router/router.service';
import { timer, Subscription } from 'rxjs';

@Component({
  selector: 'app-vbox-edit',
  templateUrl: './vbox-edit.component.html',
  styleUrls: ['./vbox-edit.component.scss']
})
export class VboxEditComponent implements OnInit {

  languages: string[];
  languageEnum: typeof Language = Language;
  configSelected: VBoxMonitorConfiguration;
  changeDataOngoing: boolean;
  status: typeof ErrorStatus = ErrorStatus;
  saveDataStatus: ErrorStatus;
  saveDataOngoing: boolean;
  constructor(private settings: AppSettings, public vboxService: VboxService, private router: RouterService) {

  }

  ngOnInit() {
    // when reload the page, the system redirect the user to vbox list page
    if (!this.vboxService.vBoxSelected) {
      this.router.getRouter().navigateByUrl('/admin/vbox');
    } else {
      this.languages = this.settings.supportedLang;
      this.changeDataOngoing = false;
      this.selectTVConfiguration(0, this.vboxService.vBoxSelected.MonitorConfigurations[0]);

    }
  }


  changeLanguage(lang: string) {
    this.vboxService.vBoxSelected.language = lang;
    this.vboxService.vBoxSelected.MonitorConfigurations.map(config => config.Language = lang);
    this.changeDataOngoing = true;
  }

  selectTVConfiguration(idx, tv) {
    this.vboxService.vBoxSelected.vBoxMonitorSelectedIdx = idx;
    // check if the language TV selected is null
    if (tv.Language === null || !tv.Language) {
      tv.Language = this.languages[0];
    }
    this.configSelected = tv;
  }


  onChangeSportToTv(category?: VBoxAvailableCategoryType): void {
    if (!category) {
      category = {
        CategoryType: null,
        SportId: 0
      };
    }
    this.vboxService.vBoxSelected.MonitorConfigurations[this.vboxService.vBoxSelected.vBoxMonitorSelectedIdx].SportId = category.SportId;
    this.vboxService.vBoxSelected.MonitorConfigurations[this.vboxService.vBoxSelected.vBoxMonitorSelectedIdx].CategoryType =
      category.CategoryType;
    this.changeDataOngoing = true;
  }


  onSaveData(): void {
    this.changeDataOngoing = false;
    this.saveDataOngoing = true;
    this.vboxService.saveData().then(
      response => {
        this.saveDataStatus = response.Status;
        if (this.saveDataStatus === ErrorStatus.Success) {
          this.callback_SaveData();
        }
      }, error => {
        this.saveDataStatus = ErrorStatus.UnknownError;
        this.callback_SaveData();
      }
    );
  }


  callback_SaveData(): void {
    const subScribeTimer: Subscription = timer(5000).subscribe(
      () => {
        this.saveDataStatus = null;
        this.saveDataOngoing = false;
        subScribeTimer.unsubscribe();
      }
    );
  }
}
