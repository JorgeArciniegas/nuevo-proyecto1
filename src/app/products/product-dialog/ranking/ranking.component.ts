import { Component, Input } from '@angular/core';
import { LAYOUT_TYPE } from '../../../../../src/environments/environment.models';
import { BetDataDialog } from '../../products.model';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent {
  @Input()
  data: BetDataDialog;
  layout: typeof LAYOUT_TYPE = LAYOUT_TYPE;

  constructor() {
  }
}
