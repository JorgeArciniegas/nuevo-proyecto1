// tslint:disable-next-line:max-line-length
import { VirtualBetCompetitor, VirtualBetEvent, VirtualBetMarket, VirtualBetSelection, VirtualBetTournament, VirtualGetRankByEventResponse } from '@elys/elys-api';
import { RouletteNumber } from './playable-board/templates/american-roulette/american-roulette.models';
import { KenoNumber } from './playable-board/templates/keno/keno.model';

export enum TypePlacingEvent {
  ST = 0,
  ACCG = 1,
  R = 2
}

export enum SpecialBet {
  EVEN = 0,
  ODD = 1,
  OVER = 2,
  UNDER = 3
}
export enum SpecialBetValue {
  '2-4-6' = 0,
  '1-3-5' = 1,
  '4-5-6' = 2,
  '1-2-3' = 3
}

export enum Podium {
  WINNER = 1,
  PLACED = 2,
  SHOW = 3
}

export enum SmartCodeType {
  V = 1,
  '2P',
  '3P',
  AO,
  AS,
  UP,
  OP,
  DP,
  PP,
  T,
  TOX,
  TNX, // Trifecta
  TR, // multiple selezione Trio in ordine con ritorno
  VX,
  AX,
  ASX,
  AOX,
  '1PX',
  '1VA',
  AB, // Quinella with base and tail
  VT, // Winning trio
  AR, // Quinella in order with return
  AT, // Combined trio
  S, // Sector
  OU, // Over/Under
  MULTI, // Multiple selections
  R, // AMERICAN ROULETTE NUMBER
  RC, // AMERICAN ROULETTE COLUMN
  RD, // AMERICAN ROULETTE DOZEN
  RS, // AMERICAN ROULETTE SILVER
  RG, // AMERICAN ROULETTE GOLD
  RA, // AMERICAN ROULETTE AMERICANA
  RM, // AMERICAN ROULETTE SMALL
}

// Enum of the type of combinations available.
export enum CombinationType {
  By2, // Combination by 2. Ex: 1234 -> 1-2, 1-3, 1-4, 2-1, 2-3, 2-4 ecc.
  By3 // Combination by 3. Ex: 1234 -> 1-2-3, 1-3-4, 1-2-4, 2-1-3, 2-3-4, 3-1-2 ecc.
}

export enum TypeBetSlipColTot {
  COL,
  TOT,
  GROUP
}

export class PlacingEvent {
  eventNumber: number;
  typePlace: TypePlacingEvent;
  secondRowDisabled: boolean;
  thirdRowDisabled: boolean;
  players: Player[];
  odds: VirtualBetSelectionExtended[];
  kenoNumbers?: KenoNumber[];
  coloursNumbers?: number[];
  coloursSelection: string;
  amount: number;
  repeat: number;
  isSpecialBets: boolean;
  specialBetValue: SpecialBet;
  timeBlocked: boolean;
  smartcode?: SmartCodeType;
  // AmericanRoulette
  rouletteNumber?: RouletteNumber[];
  constructor() {
    this.eventNumber = 0;
    this.repeat = 1;
    this.amount = 0;
    this.isSpecialBets = false;
    this.players = [];
    this.odds = [];
    this.secondRowDisabled = false;
    this.thirdRowDisabled = false;
    // this.dogs = new Dog();
  }
}

export class Player {
  number: number;
  selectable: boolean;
  actived: boolean;
  position: number;
  constructor() {
    this.number = 0;
    this.selectable = true;
    this.actived = false;
    this.position = 0;
  }
}

export class EventTime {
  minute: number;
  second: number;
}

export class EventInfo {
  number: number;
  label: string;
  date: Date;
}

export class EventDetail {
  constructor(eventsToShow: number) {
    this.eventTime = new EventTime();
    this.events = new Array(eventsToShow);
    this.currentEvent = 0;
  }
  eventTime: EventTime;
  events: EventInfo[];
  currentEvent: number;
}

export class Smartcode {
  code: string;
  selWinner: number[];
  selPlaced: number[];
  selPodium: number[];
  constructor(
    win: number[] = [],
    placed: number[] = [],
    podium: number[] = []
  ) {
    this.selPlaced = placed;
    this.selPodium = podium;
    this.selWinner = win;
  }
}

export interface VirtualBetTournamentExtended extends VirtualBetTournament {
  matches?: Match[];
  overviewArea?: Area[];
  listDetailAreas?: ListArea[];
  ranking?: VirtualGetRankByEventResponse;
}

export interface VirtualBetEventExtended extends VirtualBetEvent {
  mk: VirtualBetMarketExtended[];
}

export interface VirtualBetMarketExtended extends VirtualBetMarket {
  sls: VirtualBetSelectionExtended[];
}

export interface VirtualBetSelectionExtended extends VirtualBetSelection {
  marketId?: number;
  isLowestOdd?: boolean;
  isHighestOdd?: boolean;
  // An odd is valid when its value is greater than 1.05.
  isValid?: boolean;
}

export interface ListArea {
  areas: Area[];
}

export interface Area {
  id: number;
  name: string;
  markets: MarketArea[];
  layoutDefinition?: LayoutGridDefinition;
  isSelected?: boolean;
  hasLowestOdd?: boolean;
  hasHighestOdd?: boolean;
}

export interface MarketArea {
  id: number;
  name: string;
  hasSpecialValue?: boolean;
  specialValueOrSpread: string;
  selectionCount: number;
  selections?: VirtualBetSelectionExtended[];
  layoutGridDefinition?: LayoutGridDefinition;
}

export interface Match {
  id: number;
  name: string;
  smartcode: number;
  isVideoShown: boolean; // when it is true, the camera's icon should be active. The default value is false.
  hasOddsSelected: boolean;
  isDetailOpened: boolean;
  selectedOdds: number[];
  virtualBetCompetitor: VirtualBetCompetitor[];
}

export interface LayoutGridDefinition {
  areaCols?: number;
  // tslint:disable-next-line:max-line-length
  areaMaxMarketColsByCol?: number[]; // Max number of market's columns into the area column (mathematical minum common multiple). The array index identify the column for whom is valid the setting.
  areaRowsByCol?: number[]; // Number of rows per area column. The array index identify the column for whom is valid the setting.
  marketPositionOnColArea?: number;
  marketCols?: number;
  marketRows?: number;
}

// Interface of the object used to host the data of the lower and higher odd.
export interface SpecialOddData {
  areaIndex: number;
  marketIndex: number;
  oddIndex: number;
  val: number;
}
