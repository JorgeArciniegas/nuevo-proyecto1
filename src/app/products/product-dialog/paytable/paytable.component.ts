import { Component, Input } from '@angular/core';
import { LAYOUT_TYPE } from '../../../../environments/environment.models';
import { BetDataDialog } from '../../products.model';

@Component({
  selector: 'app-paytable',
  templateUrl: './paytable.component.html',
  styleUrls: ['./paytable.component.scss']
})
export class PaytableComponent {
  @Input()
  data: BetDataDialog;
  LAYOUT_TYPE: typeof LAYOUT_TYPE = LAYOUT_TYPE;

  constructor() { }

}
