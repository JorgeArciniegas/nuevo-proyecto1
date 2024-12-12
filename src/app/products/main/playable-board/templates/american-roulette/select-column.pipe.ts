import { Pipe, PipeTransform } from '@angular/core';
import { RouletteNumber } from './american-roulette.models';

@Pipe({
  name: 'selectColumn'
})
export class SelectColumnPipe implements PipeTransform {

  transform(value: RouletteNumber[], column: number): any {

    const tmp: RouletteNumber[] = [];
    for (const t of value) {
      if (t.number % 3 === column) {
        tmp.push(t);
      }
    }


    return tmp;
  }

}
