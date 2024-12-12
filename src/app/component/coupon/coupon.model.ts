import { BetCouponOdd, BetCouponGroup } from '@elys/elys-api';
import { BetCouponExtended, MessageSource } from '@elys/elys-coupon';

export interface StakesDisplay {
  TotalStake: number;
  MaxWinning: number;
}

export interface OddsStakeEdit {
  indexOdd: number;
  tempStake: number;
  tempStakeStr?: string;
  odd: BetCouponOdd;
  grouping?: BetCouponGroup;
  isDefaultInput: boolean;
  hasDecimalSeparator?: boolean;
}

export interface InternalCoupon extends BetCouponExtended {
  internal_isReadyToPlace?: boolean;
  internal_isLottery?: boolean;
  internal_isColours?: boolean;
  internal_isAmericanRoulette?: boolean;
}

/**
 * Object of the coupon's error.
 * @attribute message. Error message.
 * @attribute source. Source of the message. API type (Enum MessageSource of the Coupon library) that has generated the message.
 * @attribute detail. Additional information about the error. Example: The amount of a limit that was overcome.
 * @attribute location. Location of the errors if they are generated from specific selections of the coupon.
 *            It contains the "oddId" of the selections in error.
 */
export class Error {
  message: string;
  source: MessageSource;
  location: number[] = [];
  detail?: string | number;

  constructor(message?: string, source?: MessageSource, detail?: string | number, location?: number) {
    this.message = message || undefined;
    this.source = source || undefined;
    if (detail) {
      this.detail = detail;
    }
    if (location) {
      this.location.push(location);
    }
  }

  /**
   * Method to set the error object
   * @param message Error message.
   * @param source Source of the message. API type (Enum MessageSource of the Coupon library) that has generated the message.
   * @param detail Additional information about the error. Example: The amount of a limit that was overcome.
   * @param location Option parameter to indicate the location of the error if available.
   */
  setError(message: string, source: MessageSource, detail?: string | number, location?: number) {
    this.message = message;
    this.source = source;
    this.detail = detail || null;
    this.location = [location] || null;
  }

  addLocation(location: number) {
    if (this.location) {
      this.location.push(location);
    } else {
      this.location = [location];
    }
  }

  isEmpty(): boolean {
    return this.message === undefined;
  }
}

// Enum of the coupon's limites errors
export enum CouponLimit {
  MinBetStake,
  MaxBetStake,
  MaxSingleBetWin,
  MaxMultipleBetWin,
  MaxCombinationBetWin,
  MaxCouponOdds,
  MaxCouponEvents,
  MinBonusOdd,
  MaxCouponCombinations,
  MinGroupingsBetStake,
  MaxGroupingsBetStake,
  MaxCombinationsByGrouping,
  MaxCombinationsByCoupon,
  MinCombinationBetRate
}

export interface ShortcutToCoupon {
  code: string;
  val: string;
}
