import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface OperationData {
  name: string;
  isLoading: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private queueOperation = [];
  public isLoading = new BehaviorSubject(false);
  // INFO OF OPERATION LOADING
  private _operationDataDetailOdds: OperationData;
  public get operationDataDetailOdds(): OperationData {
    return this._operationDataDetailOdds;
  }
  public set operationDataDetailOdds(value: OperationData) {
    this._operationDataDetailOdds = value;
  }

  constructor() { }

  setLoading(actived: boolean, operation: string) {
    const checkOperationIndex = (op) => op === operation;
    const indexOperationOnQueue = this.queueOperation.findIndex(checkOperationIndex);
    if (indexOperationOnQueue !== -1 && actived) {
      return;
    }

    this.operationDataDetailOdds = { name: operation, isLoading: actived };

    if (!this.isLoading.getValue() && actived) {
      this.isLoading.next(true);
      this.queueOperation = [];
      this.queueOperation.push(operation);
    } else if (this.isLoading.getValue() && !actived) {

      this.queueOperation.splice(indexOperationOnQueue);
      this.isLoading.next(false);

    }
  }

}
