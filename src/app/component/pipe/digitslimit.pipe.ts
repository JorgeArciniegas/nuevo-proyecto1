import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'digitslimit'
})
export class DigitslimitPipe implements PipeTransform {
  transform(value: number, limit?: number): any {
    const valuePreset = value.toString();
    if (!value) {
      return null;
    } else if (value > 999 && value < 9999) {
      return valuePreset.substr(0, 1) + 'K';
    } else if (value > 9999 && value < 99999) {
      return valuePreset.substr(0, 2) + 'K';
    }  else if (value > 99999 && value < 999999) {
      return valuePreset.substr(0, 3) + 'K';
    } else if (value > 999999 && value < 9999999 ) {
      return valuePreset.substr(0, 1) + 'M';
    } else if (value > 9999999 && value < 99999999 ) {
        return valuePreset.substr(0, 2) + 'M';
    } else if (value > 99999999 && value < 999999999 ) {
        return valuePreset.substr(0, 3) + 'M';
    } else {
      return value;
    }
  }
}
