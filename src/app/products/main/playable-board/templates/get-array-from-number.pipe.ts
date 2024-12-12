import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getArrayFromNumber'
})
export class GetArrayFromNumberPipe implements PipeTransform {
  transform(value: number): Array<any> {
    return new Array(value);
  }
}
