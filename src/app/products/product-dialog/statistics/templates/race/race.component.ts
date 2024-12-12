import { Component, OnInit, Input } from '@angular/core';
import { BetDataDialog } from '../../../../../../../src/app/products/products.model';
import { DialogService } from '../../../../../../../src/app/products/dialog.service';

@Component({
  selector: 'app-statistics-race ',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss']
})
export class RaceComponent implements OnInit {

  @Input()
  data: BetDataDialog;

  rows: string;
  maxDataStatistics: number;

  constructor(private dialog: DialogService) {
    this.maxDataStatistics = 1;
    this.rows = '';
  }

  ngOnInit() {

    /**
     * Defined coefficent percentage for fitness status
     */
    this.data.statistics.virtualBetCompetitor.sort( (a, b) => a.ito <= b.ito ? -1 : 1 );
    this.data.statistics.virtualBetCompetitor.map( item => {
      this.rows += '3*,'; // Indicate the rows text value append to GridLayout
      this.maxDataStatistics += item.ff;
    });
    this.rows = this.rows.substr(0, this.rows.length - 1); // removed last `,` to string Rows
    this.maxDataStatistics = this.maxDataStatistics ;
  }

  close(): void {
    this.dialog.closeDialog();
  }
}
