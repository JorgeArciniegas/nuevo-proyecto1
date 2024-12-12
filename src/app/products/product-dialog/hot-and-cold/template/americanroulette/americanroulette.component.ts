import { Component, Input } from '@angular/core';
import { BetDataDialog } from '../../../../../products/products.model';
import { DialogService } from '../../../../../products/dialog.service';

@Component({
  selector: 'app-hot-and-cold-americanroulette, [app-hot-and-cold-americanroulette]',
  templateUrl: './americanroulette.component.html',
  styleUrls: ['./americanroulette.component.scss']
})
export class AmericanrouletteComponent {

  @Input()
  data: BetDataDialog;
  Math = Math;

  constructor(private dialog: DialogService) {}

  close(): void {
  this.dialog.closeDialog();
}

}
