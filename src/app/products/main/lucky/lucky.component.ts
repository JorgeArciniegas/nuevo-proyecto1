import { Component } from '@angular/core';
import { ProductsService } from '../../products.service';
import { LAYOUT_TYPE } from '../../../../../src/environments/environment.models';
@Component({
  selector: 'app-lucky, [app-lucky]',
  templateUrl: './lucky.component.html',
  styleUrls: ['./lucky.component.scss']
})
export class LuckyComponent {
  typeLayout: typeof LAYOUT_TYPE = LAYOUT_TYPE;
  constructor(public productService: ProductsService) { }
}
