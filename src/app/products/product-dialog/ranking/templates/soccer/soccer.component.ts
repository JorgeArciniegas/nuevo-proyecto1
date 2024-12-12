import { Component, Input, OnInit } from '@angular/core';
import { RankRow } from '@elys/elys-api';
import { AppSettings } from '../../../../../app.settings';
import { BetDataDialog } from '../../../../../products/products.model';
import { DialogService } from '../../../../../products/dialog.service';

@Component({
  selector: 'app-ranking-soccer',
  templateUrl: './soccer.component.html',
  styleUrls: ['./soccer.component.scss']
})
export class SoccerComponent implements OnInit {
  @Input()
  data: BetDataDialog;
  public page = 0;
  public maxPage = 2;
  maxItems = 10;
  public teamsData: RankRow[];

  constructor(private dialog: DialogService,public settings: AppSettings) { }

  ngOnInit() {
    if (this.data.tournamentRanking.ranking && this.data.tournamentRanking.ranking.RankRows) {
      this.filterRow();
    }
  }

  filterRow(): void {
    const start = this.page * this.maxItems;
    let end = (this.page + 1) * this.maxItems;
    if (end > this.data.tournamentRanking.ranking.RankRows.length) {
      end = this.data.tournamentRanking.ranking.RankRows.length;
    }
    this.teamsData = this.data.tournamentRanking.ranking.RankRows.slice(start, end);
  }

  previusTeams() {
    if (this.page <= 0) {
      return;
    }
    this.page--;
    this.filterRow();
  }

  nextTeams() {
    if (this.page >= this.maxPage - 1) {
      return;
    }
    this.page++;
    this.filterRow();
  }

  close(): void {
    this.dialog.closeDialog();
  }
}
