import { Pipe, PipeTransform } from '@angular/core';
import { VirtualBetCompetitor } from '@elys/elys-api';

/**
 * Pipe to get the competitor's name associated with the selection passed.
 * This information is gotten through the ito code indicated into the selection's name.
 */
@Pipe({
  name: 'competitorName'
})
export class CompetitorNamePipe implements PipeTransform {
  transform(selectionName: string, competitors: VirtualBetCompetitor[]): string {
    let competitorName = '';
    if (selectionName.indexOf('1') === 0) {
      competitorName = competitors.find(competitor => competitor.ito === 1).nm;
    } else if (selectionName.indexOf('2') === 0) {
      competitorName = competitors.find(competitor => competitor.ito === 2).nm;
    }
    return competitorName;
  }
}
