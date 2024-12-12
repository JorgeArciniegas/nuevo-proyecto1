import { Pipe, PipeTransform } from '@angular/core';
import { MarketArea } from '../main.models';

@Pipe({
  name: 'filterMarketsByAreaColumn'
})
export class FilterMarketsByAreaColumnPipe implements PipeTransform {
  transform(markets: MarketArea[], areaColumn: number): MarketArea[] {
    return markets.filter(market => market.layoutGridDefinition.areaCols === areaColumn);
  }
}
