// tslint:disable-next-line:max-line-length
import { BetCouponGroup, HotAndColdNumbers, LotteryPayoutMarket, VirtualBetCompetitor, VirtualGetRankByEventResponse } from '@elys/elys-api';
import { BetCouponExtended } from '@elys/elys-coupon';
import { LAYOUT_TYPE } from '../../../src/environments/environment.models';
import { TYPINGTYPE } from '../component/btncalc/btncalc.enum';
import { SmartCodeType, TypeBetSlipColTot } from './main/main.models';

export interface WindowSize {
  height: number;
  width: number;
  aspectRatio: number;
  columnHeight?: number;
  small?: boolean;
}

export class PolyfunctionalArea {
  selection?: string;
  value?: string | number;
  amount?: number;
  amountStr?: string;
  odds?: BetOdd[];
  labelColTot?: string;
  typeSlipCol?: TypeBetSlipColTot;
  activeAssociationCol?: boolean;
  activeDistributionTot?: boolean;
  hasDecimalSeparator?: boolean;
  firstTap?: boolean;
  disableInputCalculator?: boolean;
  shortcut?: SmartCodeType;
  smartBetCode?: number;
  grouping?: BetCouponGroup[];
  oddsCounter?: number; // Used for keno product on display-component
  constructor() {
    this.typeSlipCol = TypeBetSlipColTot.COL;
    this.firstTap = false;
    this.disableInputCalculator = false;
    this.amount = 0;
    this.hasDecimalSeparator = false;
    this.odds = [];
    this.oddsCounter = 0;
  }
}

export class PolyfunctionalStakeCoupon {
  digitAmount: number;
  totalAmount: number;
  columnAmount: number;
  columns: number;
  typeSlipCol: TypeBetSlipColTot;
  isEnabled: boolean;
  hasDecimalSeparator: boolean;
  constructor(
    digitAmount?: number,
    totalAmount?: number,
    columnAmount?: number,
    columns?: number,
    typeSlipCol?: TypeBetSlipColTot,
    isEnabled?: boolean,
    hasDecimalSeparator?: boolean
  ) {
    this.digitAmount = digitAmount || 0.0;
    this.totalAmount = totalAmount || 0.0;
    this.columnAmount = columnAmount || 0.0;
    this.columns = columns || 0;
    this.typeSlipCol = typeSlipCol ? typeSlipCol : TypeBetSlipColTot.COL;
    this.isEnabled = isEnabled || false;
    this.hasDecimalSeparator = hasDecimalSeparator || false;
  }
}
export class PolyfunctionStakePresetPlayer {
  typeSlipCol: TypeBetSlipColTot;
  amount: number;
  amountStr?: string;
  disableInputCalculator?: boolean;
  firstTap?: boolean;
  hasDecimalSeparator?: boolean;
  typingType: TYPINGTYPE;
  isPreset?: boolean;
  constructor(typeSlipCol: TypeBetSlipColTot, amount: number, isPreset?: boolean) {
    this.typeSlipCol = typeSlipCol;
    this.amount = amount;
    this.amountStr = amount.toString();
    this.hasDecimalSeparator = false;
    this.firstTap = true;
    this.disableInputCalculator = false;
    this.isPreset = isPreset || true;
    this.typingType = TYPINGTYPE.BY_PRESET;
  }
}

export class BetOdd {
  id: number;
  label: string;
  odd: number;
  amount: number;
  selected: boolean;
  constructor(label: string, odd: number, amount: number, id: number) {
    this.id = id;
    this.label = label;
    this.odd = odd;
    this.amount = amount;
    this.selected = true;
  }
}

export class BetOdds {
  odds: BetOdd[];
  constructor() {
    this.odds = [];
  }
}

export interface BetDataDialog {
  title: string;
  betOdds?: BetOdds;
  betCoupon?: BetCouponExtended;
  statistics?: StatisticDialog;
  groupings?: BetCouponGroup[];
  tournamentRanking?: TournamentRanking;
  paytable?: Payouts;
  hotAndCold?: HotAndCold;
}
export class DialogData {
  title: string;
  betOdds?: BetOdds;
  breakpoint?: number;
  opened: boolean;
  betCoupon?: BetCouponExtended;
  statistics?: StatisticDialog;
  groupings?: BetCouponGroup[];
  tournamentRanking?: TournamentRanking;
  paytable?: Payouts;
  hotAndCold?: HotAndCold;
  constructor(
    betOdds?: BetOdds,
    breakpoint?: number,
    betCoupon?: BetCouponExtended,
    title?: string,
    statistics?: StatisticDialog,
    groupings?: BetCouponGroup[],
    tournamentRanking?: TournamentRanking,
    paytable?: Payouts,
    hotAndCold?: HotAndCold
  ) {
    this.betOdds = betOdds;
    this.breakpoint = breakpoint;
    this.opened = false;
    this.betCoupon = betCoupon || null;
    this.statistics = statistics || null;
    this.groupings = groupings || null;
    this.tournamentRanking = tournamentRanking || null;
    this.paytable = paytable || null;
    this.hotAndCold = hotAndCold || null;
  }
}
export interface StatisticDialog {
  codeProduct: string;
  virtualBetCompetitor: VirtualBetCompetitor[];
  layoutProducts: LAYOUT_TYPE;
}

export interface TournamentRanking {
  codeProduct: string;
  ranking: VirtualGetRankByEventResponse;
  layoutProducts: LAYOUT_TYPE;
}

export interface Payouts {
  codeProduct: string;
  payouts: LotteryPayoutMarket[];
  layoutProducts: LAYOUT_TYPE;
  selectionNumber: number;
  selectionString?: string;
  market?: string;
}

export interface HotAndCold {
  codeProduct: string;
  hotAndColdNumbers: HotAndColdNumbers;
  layoutProducts: LAYOUT_TYPE;
}

export enum DialogTypeCoupon {
  DELETE,
  PAY
}

/**
 * When "checked" parameter is true Destroycoupon is enabled
 */
export interface CouponConfirmDelete {
  productCodeRequest?: string;
  checked: boolean;
  isRacing?: boolean;
  eventNumber?: number;
}

// Enum of the markets
export enum Market {
  '1X2' = 10,
  'OddEven' = 45,
  'OverUnder' = 60,
  'WinningSector' = 171,
  '1X2WinningSector' = 172,
  '1X2OverUnder' = 689,
  // AMERICAN ROULETTE
  'StraightUp' = 725,
  'DozenBet' = 726,
  'ColumnBet' = 727,
  'HighLow' = 728,
  'RedBlack' = 729
}

/**
 * Enum of the selection identifier to show on the polyfunctional area.
 * It contains the "Selection: " prefix to be able to define values of the enum whoes name would have contained only number.
 * Operation not allowed in JavaScript.
 * Ex: '1' the value of the selection '1' of the market '1X2'.
 * */
export enum SelectionIdentifier {
  'Selection: 1' = '1',
  'Selection: X' = 'X',
  'Selection: 2' = '2',
  'Selection: S1' = 's1',
  'Selection: S2' = 's2',
  'Selection: S3' = 's3',
  'Selection: S4' = 's4',
  'Selection: 1 + S1' = '1s1',
  'Selection: 1 + S2' = '1s2',
  'Selection: 1 + S3' = '1s3',
  'Selection: 1 + S4' = '1s4',
  'Selection: 2 + S1' = '2s1',
  'Selection: 2 + S2' = '2s2',
  'Selection: 2 + S3' = '2s3',
  'Selection: 2 + S4' = '2s4',
  'Selection: Over' = 'o',
  'Selection: Under' = 'u',
  'Selection: 1 + Over' = '1o',
  'Selection: 1 + Under' = '1u',
  'Selection: 2 + Over' = '2o',
  'Selection: 2 + Under' = '1u',
  'ARoulette' = 'AR'
}
