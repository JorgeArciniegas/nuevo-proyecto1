import { Component, Input, OnInit } from '@angular/core';
import { MainService } from '../../../main.service';
import { AmericanRouletteRug, COLORS } from './american-roulette.models';
import { VirtualBetSelection } from '@elys/elys-api';
import { Market } from '../../../../../products/products.model';
import { SmartCodeType } from '../../../main.models';
import { ProductsService } from '../../../../../products/products.service';

@Component({
  selector: 'app-playable-board-american-roulette',
  templateUrl: './american-roulette.component.html',
  styleUrls: ['./american-roulette.component.scss']
})
export class AmericanRouletteComponent implements OnInit {

  americanRouletteRug: AmericanRouletteRug;
  @Input()
  public rowHeight: number;

  color: typeof COLORS = COLORS;
  marketSelection: typeof Market = Market;

  // Selections by play
  public dozenSelected: number[];
  public columnSelected: number[];
  public numberSelected: string[];
  public otherPlayed: string[];

  // Event Selection
  tempEventSelected: number;

  constructor(private service: MainService, private productService: ProductsService) {
    this.americanRouletteRug = new AmericanRouletteRug();
    this.dozenSelected = [];
    this.columnSelected = [];
    this.numberSelected = [];
    this.otherPlayed = [];
    this.tempEventSelected = this.service.eventDetails.currentEvent;
  }

  ngOnInit() {
    this.productService.playableBoardResetObserve.subscribe(reset => {
      if (reset) {
        this.resetBoard();
      }
    });
    this.service.currentEventObserve.subscribe(item => {
      if (this.service.toResetAllSelections) {
        this.tempEventSelected = item;
        this.resetBoard();
      }
    });
  }

  private resetBoard(): void {
    this.dozenSelected = [];
    this.columnSelected = [];
    this.numberSelected = [];
    this.otherPlayed = [];
  }

  onSelectedNumber(n: number | string): void {
    if (this.numberSelected.includes(n.toString())) {
      this.numberSelected.splice(this.numberSelected.indexOf(n.toString()), 1);
    } else {
      this.numberSelected.push(n.toString());
    }

    this.service.getCurrentEvent().then(item => {
      const selection: VirtualBetSelection = item.mk.find(i => i.tp === Market.StraightUp).sls.find(odd => odd.nm === n.toString());
      this.service.placingNumberRoulette(Market.StraightUp, selection, SmartCodeType.R);
    });
  }

  onSelectedColumn(n: number): void {
    if (this.columnSelected.includes(n)) {
      this.columnSelected.splice(this.columnSelected.indexOf(n), 1);
    } else {
      this.columnSelected.push(n);
    }

    this.service.getCurrentEvent().then(item => {
      const selection: VirtualBetSelection = item.mk.find(i => i.tp === Market.ColumnBet).sls.find(odd => odd.tp === n);
      this.service.placingNumberRoulette(Market.ColumnBet, selection, SmartCodeType.RC);
    });
  }

  onSelectedDozen(n: number): void {
    if (this.dozenSelected.includes(n)) {
      this.dozenSelected.splice(this.dozenSelected.indexOf(n), 1);
    } else {
      this.dozenSelected.push(n);
    }
    this.service.getCurrentEvent().then(item => {
      const selection: VirtualBetSelection = item.mk.find(i => i.tp === Market.DozenBet).sls.find(odd => odd.tp === n);
      this.service.placingNumberRoulette(Market.DozenBet, selection, SmartCodeType.RD);
    });
  }

  onSelected(n: string, market: Market): void {
    if (this.otherPlayed.includes(n)) {
      this.otherPlayed.splice(this.otherPlayed.indexOf(n), 1);
    } else {
      this.otherPlayed.push(n);
    }

    this.service.getCurrentEvent().then(item => {
      const selection: VirtualBetSelection = item.mk.find(i => i.tp === market).sls.find(odd => odd.nm === n.toString());
      this.service.placingNumberRoulette(market, selection, SmartCodeType.R);
    });
  }

  getDozen(n: number): boolean {
    return this.dozenSelected.includes(n);
  }

  getColumn(col: number): boolean {
    return this.columnSelected.includes(col);
  }

  getNumberSelectedByColumn(col: number, n: number): boolean {
    if (!this.columnSelected.includes(col)) {
      return false;
    }
    let result = false;
    switch (col) {
      case 1:
        result = this.americanRouletteRug.columnFirst.includes(n);
        break;
      case 2:
        result = this.americanRouletteRug.columnSecond.includes(n);
        break;
      case 3:
        result = this.americanRouletteRug.columnThird.includes(n);
        break;
      default:
        break;
    }
    return result;
  }


  getNumberSelected(n: string): boolean {
    return this.numberSelected.includes(n.toString());
  }


  getOtherPointSelected(played: string): boolean {
    return this.otherPlayed.includes(played);
  }
}
