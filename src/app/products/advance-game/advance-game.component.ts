import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { TypePlacingEvent } from '../main/main.models';
import { MainService } from '../main/main.service';
import { UserService } from '../../../../src/app/services/user.service';
import { AdvButton } from './advance-game.model';
import { timer, Subscription } from 'rxjs';
import { LayoutProducts, LAYOUT_TYPE } from '../../../../src/environments/environment.models';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-advance-game, [app-advance-game]',
  templateUrl: './advance-game.component.html',
  styleUrls: ['./advance-game.component.scss']
})
export class AdvanceGameComponent implements OnInit {

  @Input()
  public timeBlocked = false;
  @Input()
  public rowHeight: number;

  public buttons: AdvButton[] = [];

  // Layout current product
  public get layoutProducts(): LayoutProducts {
    return this.productService.product ? this.productService.product.layoutProducts : undefined;
  }

  layoutType: typeof LAYOUT_TYPE = LAYOUT_TYPE;

  constructor(public service: MainService, public productService: ProductsService, private userService: UserService) {
  }

  ngOnInit() {
    this.buttons.push({
      label: TypePlacingEvent[0],
      code: TypePlacingEvent['ST']
    });
    this.buttons.push({
      label: TypePlacingEvent[1],
      code: TypePlacingEvent['ACCG']
    });
    this.buttons.push({
      label: TypePlacingEvent[2],
      code: TypePlacingEvent['R']
    });
  }

  setTypePlacing(type: TypePlacingEvent): void {
    this.service.typePlacing(type);
  }

}

