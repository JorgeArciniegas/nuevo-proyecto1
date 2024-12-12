import { Pipe, PipeTransform } from '@angular/core';
import { MarketArea } from '../main.models';

@Pipe({
  name: 'extractCorrectScore'
})
export class ExtractCorrectScorePipe implements PipeTransform {

  transform(markets: MarketArea[], selector: string): any {

    if (!markets) {
      return null;
    }
    const tmpMarkets: MarketArea[] = [{
      id: markets[0].id,
      name: markets[0].name,
      hasSpecialValue: markets[0].hasSpecialValue,
      layoutGridDefinition:  markets[0].layoutGridDefinition,
      selectionCount: 0,
      selections: [],
      specialValueOrSpread:  markets[0].specialValueOrSpread
    }];


     const tmpSelections =  markets[0].selections.filter( selection => {
        const determinateSelection = selection.nm.split(':');

        if ( Number(determinateSelection[0]) > Number(determinateSelection[1]) && selector === '1') {
          return selection;
        } else if (  Number(determinateSelection[0]) === Number(determinateSelection[1]) && selector === 'X') {
          return selection;
        } else  if (  Number(determinateSelection[0]) < Number(determinateSelection[1]) && selector === '2') {
          return selection;
        }
      });

      tmpMarkets[0].selectionCount = tmpSelections.length;
      tmpMarkets[0].selections = tmpSelections;

    return tmpMarkets;

  }

}
