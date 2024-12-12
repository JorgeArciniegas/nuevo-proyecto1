import { Component, Input } from '@angular/core';
import { BetDataDialog } from '../../../../../products/products.model';
import { DialogService } from '../../../../../products/dialog.service';

@Component({
  selector: 'app-paytable-keno',
  templateUrl: './keno.component.html',
  styleUrls: ['./keno.component.scss']
})
export class KenoComponent {
  @Input()
  data: BetDataDialog;

  constructor(private dialog: DialogService) { }

  close(): void {
    this.dialog.closeDialog();
  }

}
