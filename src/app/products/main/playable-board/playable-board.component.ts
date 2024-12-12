import { Component, Input } from '@angular/core';
import { LAYOUT_TYPE } from '../../../../../src/environments/environment.models';
import { ProductsService } from '../../products.service';
@Component({
  selector: 'app-playable-board, [app-playable-board]',
  templateUrl: './playable-board.component.html',
  styleUrls: ['./playable-board.component.scss']
})
export class PlayableBoardComponent {
  @Input()
  public rowHeight: number;
  public typeLayout: typeof LAYOUT_TYPE = LAYOUT_TYPE;

  constructor(public productService: ProductsService) { }
}
