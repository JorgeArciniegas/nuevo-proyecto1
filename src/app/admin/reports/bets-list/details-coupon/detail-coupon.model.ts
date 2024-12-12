import { CouponGroup, CouponOdd, CouponStatus } from '@elys/elys-api';

export interface OddsEventRows {
  couponStatus?: CouponStatus;
  odd: CouponOdd[];
  pageOdd?: number;
  pageOddRows?: number;
  maxPage?: number;
}

export interface GroupingsRows {
  groupings: CouponGroup[];
  pageGrouping?: number;
  pageGroupingRows?: number;
  maxPage?: number;
  couponStake?: number;
}
