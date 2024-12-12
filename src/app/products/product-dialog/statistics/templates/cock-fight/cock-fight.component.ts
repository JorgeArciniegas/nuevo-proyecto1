import { Component, OnInit, Input } from '@angular/core';
import { BetDataDialog } from '../../../../products.model';
import { DialogService } from '../../../../dialog.service';
import { DataStaticsChart } from './cock-fight.model';
import { AppSettings } from '../../../../../app.settings';

@Component({
  selector: 'app-statistics-cock-fight',
  templateUrl: './cock-fight.component.html',
  styleUrls: ['./cock-fight.component.scss']
})
export class CockFightComponent implements OnInit {
  @Input()
  data: BetDataDialog;
  rows: string;
  dataStaticsChart: DataStaticsChart;
  constructor(private dialog: DialogService, public readonly appSetting: AppSettings) {
    this.dataStaticsChart = new DataStaticsChart();
    this.rows = '';
  }

  ngOnInit() {
    this.data.statistics.virtualBetCompetitor.sort((a, b) => (a.ito <= b.ito ? -1 : 1));
    this.data.statistics.virtualBetCompetitor.map(item => {
      this.rows += '4*,'; // Indicate the rows text value append to GridLayout
      this.dataStaticsChart.STRENGTH += item.ac[0];
      this.dataStaticsChart.ENDURANCE += item.ac[1];
      this.dataStaticsChart.AGILITY += item.ac[2];
    });
    this.rows = this.rows.substr(0, this.rows.length - 1); // removed last `,` to string Rows
  }

  close(): void {
    this.dialog.closeDialog();
  }
}
