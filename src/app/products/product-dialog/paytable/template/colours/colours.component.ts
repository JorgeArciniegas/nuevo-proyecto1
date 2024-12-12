import { Component, OnInit } from '@angular/core';
import { LotteryPayoutSelection } from '@elys/elys-api';
import { TranslateUtilityService } from '../../../../../shared/language/translate-utility.service';
import { ColoursCommonComponent } from './colours-common.component';
import { DialogService } from '../../../../../products/dialog.service';

@Component({
  selector: 'app-paytable-colours',
  templateUrl: './colours.component.html',
  styleUrls: ['./colours.component.scss']
})
export class ColoursComponent extends ColoursCommonComponent implements OnInit {

  public gameSelections: LotteryPayoutSelection[];
  constructor(
    private dialog: DialogService,
    private translateUtilityService: TranslateUtilityService
    ) {
    super();
  }

  close(): void {
    this.dialog.closeDialog();
  }

  ngOnInit() {
    this.filterPayout();
  }

  public getSelectionName(selectionName: string): string {
    switch (selectionName.substring(0, 1).toLowerCase()) {
      case 'b': return this.translateUtilityService.getTranslatedString('BLUE');
      case 'r': return this.translateUtilityService.getTranslatedString('RED');
      case 'g': return this.translateUtilityService.getTranslatedString('GREEN');
      case 'n': return this.translateUtilityService.getTranslatedString('NO_WINNING_COLOUR');
      default:
        break;
    }
    return selectionName;
  }

}
