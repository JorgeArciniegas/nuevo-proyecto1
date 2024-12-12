import { ReportsOperatorVolumeResponse } from '@elys/elys-api';

export class OperatorSummary {
  operatorVolumes: ReportsOperatorVolumeResponse[];
  totalStake: number;
  totalVoided: number;
  totalWon: number;
  dateFrom: Date;
  dateTo: Date;
  dateStamp: Date;

  constructor(operatorVolumes: ReportsOperatorVolumeResponse[], totalStake: number, totalVoided: number,
    totalWon: number, dateFrom: Date, dateTo: Date, dateStamp: Date) {
    this.operatorVolumes = operatorVolumes;
    this.totalStake = totalStake;
    this.totalVoided = totalVoided;
    this.totalWon = totalWon;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.dateStamp = dateStamp
  }
}
