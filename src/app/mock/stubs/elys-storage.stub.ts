export class ElysStorageLibServiceStub {
  private elysStore: any = {};

  getData(key: string): any {
    return key in this.elysStore ? this.elysStore[key] : null;
  }

  setData(key: string, value: any): void {
    this.elysStore[key] = value;
  }

  checkIsExist(key: string): boolean {
    return key in this.elysStore;
  }

  destroy(): void {
    this.elysStore = {};
  }

  removeItems(keys: string | string[]): void {
    if(Array.isArray(keys)) {
      keys.forEach(key => {
        delete this.elysStore[key];
      });
    } else {
      delete this.elysStore[keys];
    }
  }

  checkDataIsValid(key: string): boolean {
    return (typeof this.elysStore[key] === 'undefined' || this.elysStore[key] === null) ? false : true;
  }
}
