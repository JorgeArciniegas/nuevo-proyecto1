import { Pipe, PipeTransform } from '@angular/core';
import { TransactionCategory } from './transactions-list.model';

@Pipe({
  name: 'getTransactionCategoryKeyByEnumValue'
})
export class GetTransactionVategoryKeyByEnumValuePipe implements PipeTransform {
  transform(enumValue: TransactionCategory): string {
    return Object.keys(TransactionCategory).filter(x => TransactionCategory[x] === enumValue)[0];
  }
}
