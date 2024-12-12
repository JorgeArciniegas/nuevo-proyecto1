import { Component, Input } from '@angular/core';
import { BetDataDialog } from '../../../../../products/products.model';
import { DialogService } from '../../../../dialog.service';
import { Colour } from '../../../../main/playable-board/templates/colours/colours.models';
@Component({
  selector: 'app-hot-and-cold-colors,[app-hot-and-cold-colors]',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss']
})
export class ColorsComponent {
  @Input()
  data: BetDataDialog;

  //Nativescript
  Math = Math;
  public Colour = Colour;
  constructor(private dialog: DialogService) { }

  close(): void {
    this.dialog.closeDialog();
  }
  /////////

  checkNumberColour(colourNumber: number): Colour {
    if (colourNumber % 3 === 1) {
      return Colour.RED;
    }
    if (colourNumber % 3 === 2) {
      return Colour.BLUE;
    }
    if (colourNumber % 3 === 0) {
      return Colour.GREEN;
    }
  }
}
