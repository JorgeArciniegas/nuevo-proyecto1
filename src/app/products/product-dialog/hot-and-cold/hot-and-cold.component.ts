import { Component, Input } from '@angular/core';
import { LAYOUT_TYPE } from '../../../../environments/environment.models';
import { BetDataDialog } from '../../products.model';

@Component({
  selector: 'app-hot-and-cold',
  templateUrl: './hot-and-cold.component.html',
  styleUrls: ['./hot-and-cold.component.scss']
})
export class HotAndColdComponent {
  @Input()
  data: BetDataDialog;
  LAYOUT_TYPE: typeof LAYOUT_TYPE = LAYOUT_TYPE;

  constructor() { }

}
