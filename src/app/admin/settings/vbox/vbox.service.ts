import { Injectable } from '@angular/core';
import { ElysApiService, VBoxConfiguration, VBoxConfigurationRequest, VBoxConfigurationResponse } from '@elys/elys-api';
import { TranslateUtilityService } from '../../../shared/language/translate-utility.service';
import { ListVbox, LocalVBoxConfiguration } from './vbox.model';

@Injectable()
export class VboxService {

  listVbox: ListVbox;
  listTempVbox: VBoxConfiguration[];
  vBoxSelected: LocalVBoxConfiguration;
  rowNumber = 10;
  constructor(private elysApi: ElysApiService, private translate: TranslateUtilityService) {
    this.initLoad();
  }

  getList(): void {
    this.elysApi.virtual.getVboxConfiguration().then(
      items => {
        this.listVbox.vBoxConfigurations = items.VBoxConfigurations;
        if (this.listVbox.vBoxConfigurations) {
          this.listVbox.vBoxConfigurations.map(item => {

            if (!item.language) {
              const tmpLanguage = item.MonitorConfigurations.filter((l) => {
                return l.Language !== null;
              });
              item.language = tmpLanguage.length > 0 ? tmpLanguage[0].Language : this.translate.getCurrentLanguage();
            }
          });
          this.listVbox.totalVboxs = items.VBoxConfigurations.length;
        }
        this.pagination();
      }
    );
  }



  initLoad(): void {
    this.listVbox = {
      actualPages: 0,
      totalPages: 0,
      totalVboxs: 0,
      vBoxConfigurations: null
    };
  }


  /**
  * Paginator
  * It define the paginator
  */
  private pagination(): void {
    if (this.listVbox.vBoxConfigurations) {
      this.listVbox.totalPages = (this.listVbox.vBoxConfigurations.length > 0)
        ? Math.ceil(this.listVbox.vBoxConfigurations.length / this.rowNumber) : 0;

      this.filterOperators();
    }
  }

  /**
   * Filter and paginate the list of operators
   */
  filterOperators(): void {
    const start = this.listVbox.actualPages * this.rowNumber;
    let end = (this.listVbox.actualPages + 1) * this.rowNumber;
    if (end > this.listVbox.totalVboxs) {
      end = this.listVbox.totalVboxs;
    }

    this.listTempVbox = this.listVbox.vBoxConfigurations.slice(start, end);
  }

  saveData(): Promise<VBoxConfigurationResponse> {
    const req: VBoxConfigurationRequest = { VBoxConfiguration: this.vBoxSelected };
    return this.elysApi.virtual.postVboxConfiguration(req);
  }
}
