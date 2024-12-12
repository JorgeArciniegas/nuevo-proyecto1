import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractSign'
})
export class ExtractSignPipe implements PipeTransform {
  transform(selectionName: string): string {
    // Remove the information about the competitor from the selection name if they are present.
    const index = selectionName.indexOf('+');
    if (index > 0 && index < 3) {
      selectionName = selectionName.substring(index + 2);
    }
    return selectionName;
  }
}
