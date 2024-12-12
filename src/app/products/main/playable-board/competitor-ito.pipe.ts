import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to get the competitor's ito associated with the selection passed.
 * This information is gotten through the ito code indicated into the selection's name.
 */
@Pipe({
  name: 'competitorIto'
})
export class CompetitorItoPipe implements PipeTransform {
  transform(selectionName: string, args?: any): number {
    let competitorIto: number;
    if (selectionName.indexOf('1') === 0) {
      // The selection is associated to the competitor's ito '1'.
      competitorIto = 1;
    } else if (selectionName.indexOf('2') === 0) {
      // The selection is associated to the competitor's ito '2'.
      competitorIto = 2;
    } else {
      // The selection is not associated to any competitor's ito.
      competitorIto = 0;
    }
    return competitorIto;
  }
}
