import { ReportsCtdAggregatesResponse } from '@elys/elys-api';

export class DataListOfCtdAggregate {
  totalPages?: number;
  actualPages?: number;
  totals?: TotalAggregators;
  aggregates: ReportsCtdAggregatesResponse[];
  constructor(
    totalPages?: number,
    actualPages?: number,

    totals?: TotalAggregators,
    aggregates?: ReportsCtdAggregatesResponse[]
  ) {
    this.totalPages = totalPages || 0;
    this.actualPages = actualPages || 0;

    this.totals = totals || { Stake: 0, MegaJackpot: 0, ShopJackpot: 0, NumberOfCoupons: 0, TotalProfit: 0, Won: 0 };
    this.aggregates = aggregates || [];

  }
}


export interface TotalAggregators {
  NumberOfCoupons: number;
  Stake: number;
  Won: number;
  ShopJackpot: number;
  MegaJackpot: number;
  TotalProfit: number;
}
