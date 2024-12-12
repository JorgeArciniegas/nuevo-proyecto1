import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'labelByGrouping'
})
export class LabelByGroupingPipe implements PipeTransform {

  transform(label: string, grouping: number, combination: number): string {
    if (!grouping || !combination) {
      return null;
    }

    switch (grouping) {
      case 1:
        label += (combination > 1) ? 'SINGLES' : 'SINGLE';
        break;
      case 2:
        label += (combination > 1) ? 'DOUBLES' : 'DOUBLE';
        break;
      case 3:
        label += (combination > 1) ? 'TRIPLES' : 'TRIPLE';
        break;
      default:
        label += (combination > 1) ? 'UPLES' : 'UPLE';
    }
    return label;
  }

}
