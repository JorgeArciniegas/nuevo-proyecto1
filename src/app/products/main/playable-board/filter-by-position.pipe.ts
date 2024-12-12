import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../main.models';

@Pipe({
  name: 'filterByPosition'
})
export class FilterByPositionPipe implements PipeTransform {
  transform(player: Player[], position?: number): Player[] {
    return player.filter(d => d.position === position);
  }
}
