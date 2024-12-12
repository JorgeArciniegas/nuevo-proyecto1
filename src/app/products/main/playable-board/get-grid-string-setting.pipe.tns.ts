import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getGridStringSetting'
})
export class GetGridStringSettingPipe implements PipeTransform {
  transform(numElements: number): string {
    let elementString = '*';
    for (let i = 1; i < numElements; i++) {
      elementString += ',*';
    }
    return elementString;
  }
}
