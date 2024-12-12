import { Component, Input } from '@angular/core';
import { LAYOUT_TYPE } from '../../../../../src/environments/environment.models';
import { BetDataDialog } from '../../products.model';

@Component({
  selector: 'app-statistics , [app-statistics]',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent {

  @Input()
  data: BetDataDialog;
  layout: typeof LAYOUT_TYPE = LAYOUT_TYPE;
  constructor() {}
}
