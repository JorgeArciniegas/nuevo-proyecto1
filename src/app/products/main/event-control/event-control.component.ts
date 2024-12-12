import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { LAYOUT_TYPE, Products } from '../../../../environments/environment.models';
import { AppSettings } from '../../../app.settings';
import { ProductsService } from '../../products.service';
import { EventInfo } from '../main.models';
import { MainService } from '../main.service';
import { WindowSizeService } from '../../../services/utility/window-size/window-size.service';

@Component({
  selector: 'app-event-control, [app-event-control]',
  templateUrl: './event-control.component.html',
  styleUrls: ['./event-control.component.scss']
})
export class EventControlComponent implements OnInit {
  typeLayout: typeof LAYOUT_TYPE = LAYOUT_TYPE;
  public isWindowSizeSmall: boolean;
  public showEventId: boolean;

  private _typeProductSelected: LAYOUT_TYPE;

  public get typeProductSelected(): LAYOUT_TYPE {
    return this._typeProductSelected;
  }

  public set typeProductSelected(value: LAYOUT_TYPE) {
    this._typeProductSelected = value;
  }

  public get product(): Products {
    return this.settings.products.find(product => product.productSelected);
  }

  public get productImageClass(): string {
    return this.product ? 'PRODUCT-' + this.product.codeProduct + '-BG' : '';
  }

  public get currentEventDetail(): EventInfo {
    return this.mainService.eventDetails.events[this.mainService.eventDetails.currentEvent];
  }

  constructor(
    public mainService: MainService,
    private productService: ProductsService,
    private settings: AppSettings,
    private windowSizeService: WindowSizeService
  ) {}

  ngOnInit() {
    timer(200).subscribe(() => {
      this.productService.resetBoard();
      this.isWindowSizeSmall = this.windowSizeService.windowSize.small;
      this.showEventId = this.settings.showEventId;
      this._typeProductSelected = this.product.layoutProducts.type;
    });
  }
}
