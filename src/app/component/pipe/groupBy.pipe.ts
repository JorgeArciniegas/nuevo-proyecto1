import { Pipe, PipeTransform } from '@angular/core';
import { CouponOdd } from '@elys/elys-api';
import { TranslateUtilityService } from '../../shared/language/translate-utility.service';

@Pipe({ name: 'groupByCategory' })
export class GroupByCategoryPipe implements PipeTransform {

  constructor(private translateUtilityService: TranslateUtilityService) { }

  transform(collection: CouponOdd[], property: string, translate: boolean = false): any {
    // prevents the application from breaking if the array of objects doesn't exist yet
    if (!collection) {
      return null;
    }
    let coloursTournament = '';
    if (collection[0].SportName === 'Colors') {
      coloursTournament = 'Colours - ';
    }
    const groupedCollection = collection.reduce((previous, current) => {
      let currentProperty: string;
      if (translate) {
        let marketName: string = current[property];
        if (marketName.toUpperCase().substring(0, marketName.length - 1) === 'RAINBOW') {
          marketName = 'RAINBOW';
        }
        currentProperty = this.translateUtilityService.getTranslatedString(marketName.toUpperCase());
      } else {
        currentProperty = current[property];
      }
      let keyTmp: string = coloursTournament + currentProperty + ' - ' + current['EventName'];
      if (!previous[keyTmp]) {
        previous[keyTmp] = [current];
      } else {
        previous[keyTmp].push(current);
      }

      return previous;
    }, {});

    // this will return an array of objects, each object containing a group of objects
    return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
  }
}
