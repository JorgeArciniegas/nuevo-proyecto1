import { Component, Input, OnInit } from '@angular/core';
import { VirtualBetCompetitor, VirtualGetRankByEventResponse } from '@elys/elys-api/lib/virtual/virtual.models';
import { BetDataDialog } from '../../../../src/app/products/products.model';
import { ProductsService } from '../../../../src/app/products/products.service';
import { LAYOUT_TYPE, Products } from '../../../../src/environments/environment.models';
import { AppSettings } from '../../app.settings';
import { MainService } from '../../products/main/main.service';
import { UserService } from '../../services/user.service';
import { IconSize } from '../model/iconSize.model';
import { ElysApiService } from '@elys/elys-api';

@Component({
  selector: 'app-widget, [app-widget]',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {
  public settings: AppSettings;

  @Input()
  private rowHeight: number;
  @Input()
  public timeBlocked = false;

  public get product(): Products {
    return this.productService.product;
  }

  public widgetIcon: IconSize;

  constructor(
    public readonly appSettings: AppSettings,
    private productService: ProductsService,
    private mainService: MainService,
    private userService: UserService,
    private elysApi: ElysApiService
  ) {
    this.settings = appSettings;
  }

  ngOnInit() {
    this.widgetIcon = new IconSize(this.rowHeight * 0.7, this.rowHeight * 0.7);
  }

  /**
   * @argument This method invoke the modal. Before to open it,
   * create the object and append the values loads from the current selected race.
   * @param typeObject
   */
  async openRouting(typeObject: string): Promise<void> {
    let virtualBetCompetitorStatistics: VirtualBetCompetitor[] = [];
    const data: BetDataDialog = { title: typeObject.toUpperCase() };
    let ranking: VirtualGetRankByEventResponse = null;
    if (
      this.productService.product.layoutProducts.type === LAYOUT_TYPE.SOCCER
    ) {
      await this.mainService.getCurrentTournament().then(async currentEventDetails => {
        ranking = await this.mainService.getRanking(currentEventDetails.pid);
        for (const match of currentEventDetails.matches) {
          virtualBetCompetitorStatistics.push(
            match.virtualBetCompetitor[0]
          );
          virtualBetCompetitorStatistics.push(
            match.virtualBetCompetitor[1]
          );
        }
      });
    } else {
      await this.mainService.getCurrentEvent().then(currentEventDetails => {
        virtualBetCompetitorStatistics = currentEventDetails.tm;
      });
    }

    switch (typeObject) {
      case 'statistic':
        data.statistics = {
          codeProduct: this.productService.product.codeProduct,
          virtualBetCompetitor: virtualBetCompetitorStatistics,
          layoutProducts: this.productService.product.layoutProducts.type
        };
        break;
      case 'ranking':
        data.tournamentRanking = {
          codeProduct: this.productService.product.codeProduct,
          ranking: ranking,
          layoutProducts: this.productService.product.layoutProducts.type
        };
        break;
      case 'hot-and-cold':
        data.hotAndCold = {
          codeProduct: this.productService.product.codeProduct,
          hotAndColdNumbers: await this.elysApi.virtual.getHotAndColdNumbers(),
          layoutProducts: this.productService.product.layoutProducts.type
        };
        break;
      case 'hot-and-cold-colors':
        data.hotAndCold = {
          codeProduct: this.productService.product.codeProduct,
          hotAndColdNumbers: await this.elysApi.virtual.getHotAndColdColors(),
          layoutProducts: this.productService.product.layoutProducts.type
        };
        break;
        case 'hot-and-cold-americanRoulette':
          data.hotAndCold = {
            codeProduct: this.productService.product.codeProduct,
            hotAndColdNumbers: await this.elysApi.virtual.getHotAndColdAmericanRoulette(),
            layoutProducts: this.productService.product.layoutProducts.type
          };
          break;

      default:
        data.statistics = null;
    }

    this.productService.openProductDialog(data);
  }
}
