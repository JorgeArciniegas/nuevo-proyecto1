export enum CouponTypeInternal {
  ALL = 0,
  SingleBet = 1,
  MultipleBet = 2,
  CombinationsBet = 3
}

export namespace CouponTypeInternal {
  export function values() {
    return Object.keys(CouponTypeInternal).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    );
  }
}

export enum CouponStatusInternal {
  ALL = 1,
  Placed,
  Win,
  Lost,
  Cancelled = 5
}

export enum OddResult {
  Lost = 0,
  Won,
  Unset
}

export namespace CouponStatusInternal {
  export function values() {
    return Object.keys(CouponStatusInternal).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    );
  }
}

export enum ShowBetDetailView {
  SUMMARY,
  EVENTS,
  COMBINATIONS
}
