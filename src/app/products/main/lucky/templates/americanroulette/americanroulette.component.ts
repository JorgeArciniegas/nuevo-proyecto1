import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../main.service';
import { Market } from '../../../../../products/products.model';
import { VirtualBetSelection } from '@elys/elys-api';
import { SmartCodeType } from '../../../main.models';

@Component({
  selector: 'app-lucky-americanroulette',
  templateUrl: './americanroulette.component.html',
  styleUrls: ['./americanroulette.component.scss']
})
export class AmericanrouletteComponent {
  smart: typeof SmartCodeType = SmartCodeType;
  constructor(private service: MainService) { }

  onSelected(n: SmartCodeType, market: Market): void {
    let arrayNumberToPlace: string[] = [];
    this.service.resetPlayEvent();
    switch (n) {
      case SmartCodeType.RS:
        arrayNumberToPlace = ['00', '1', '3', '10', '13', '15', '24', '25', '27', '36'];
        break;
      case SmartCodeType.RG:
        arrayNumberToPlace = ['5', '7', '11', '17', '20', '22', '26', '30', '32', '34'];
        break;
      case SmartCodeType.RA:
        arrayNumberToPlace = ['9', '28', '21', '6', '18', '31', '19', '8', '12', '29'];
        break;
      case SmartCodeType.RM:
        arrayNumberToPlace = ['0', '2', '14', '35', '23', '4', '16', '33'];
        break;
      default:
        break;
    }
    this.service.getCurrentEvent().then(item => {
      arrayNumberToPlace.forEach(nToPlace => {
        const selection: VirtualBetSelection = item.mk.find(i => i.tp === market).sls.find(odd => odd.nm === nToPlace);
        this.service.placingNumberRoulette(market, selection, SmartCodeType.R);
      });
    });
  }
}
