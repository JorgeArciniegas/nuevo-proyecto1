import { Component } from '@angular/core';
import { OperatorSummaryService } from '../operator-summary.service';
import { ReportsOperatorVolumeResponse } from '@elys/elys-api';
import { UserService } from '../../../../services/user.service';
import { PrintOperatorSummaryService } from './print-operator-summary/print-operator-summary.service';
import { OperatorSummary } from './print-operator-summary/operator-summary.model';

@Component({
  selector: 'app-operator-summary-list',
  templateUrl: './operator-summary-list.component.html',
  styleUrls: ['./operator-summary-list.component.scss']
})
export class OperatorSummaryListComponent {
  public TotalPages: number;
  public recordPerPage = 10;
  public currentPage = 1;
  public currentOperatorVolumes: ReportsOperatorVolumeResponse[] = [];

  constructor(public operatorSummaryService: OperatorSummaryService, public userService: UserService,
    private printOperatorSummary: PrintOperatorSummaryService) {
    this.TotalPages = Math.ceil(this.operatorSummaryService.reportsOperatorVolumeResponse.length / this.recordPerPage);
    if (this.TotalPages === 0) {
      this.TotalPages = 1;
    }
    this.currentOperatorVolumes = this.operatorSummaryService.reportsOperatorVolumeResponse.slice(this.currentPage - 1, this.recordPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.TotalPages) {
      ++this.currentPage;
      const start = (this.currentPage - 1) * this.recordPerPage;
      let end = this.currentPage * this.recordPerPage;
      if (end > this.operatorSummaryService.reportsOperatorVolumeResponse.length) {
        end = this.operatorSummaryService.reportsOperatorVolumeResponse.length;
      }
      this.currentOperatorVolumes = this.operatorSummaryService.reportsOperatorVolumeResponse.slice(
        start,
        end
      );
    }
  }

  previousPage(): void {
    if (this.currentPage >= 1) {
      --this.currentPage;
      const start = (this.currentPage - 1) * this.recordPerPage;
      let end = this.currentPage * this.recordPerPage;
      if (end > this.operatorSummaryService.reportsOperatorVolumeResponse.length) {
        end = this.operatorSummaryService.reportsOperatorVolumeResponse.length;
      }
      this.currentOperatorVolumes = this.operatorSummaryService.reportsOperatorVolumeResponse.slice(
        start,
        end
      );
    }
  }

  printUserSummary(): void {
    const operatorSummary: OperatorSummary = {
      operatorVolumes: this.operatorSummaryService.reportsOperatorVolumeResponse,
      totalStake: this.operatorSummaryService.totalStake,
      totalVoided: this.operatorSummaryService.totalVoided,
      totalWon: this.operatorSummaryService.totalWon,
      dateFrom: this.operatorSummaryService.dateFrom,
      dateTo: this.operatorSummaryService.dateTo,
      dateStamp: new Date()
    };
    this.printOperatorSummary.printWindow(operatorSummary);
  }
}
