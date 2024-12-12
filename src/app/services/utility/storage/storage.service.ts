import { Injectable } from '@angular/core';
import { ElysStorageLibService } from '@elys/elys-storage-lib';

// Service to handle the functions to operate on the LocaleStorage.
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storageService: ElysStorageLibService) { }

  /**
   * Get data.
   * @param key key to get.
   */
  public getData(key: string): any {
    return this.storageService.getData(key);
  }

  /**
   * Set data.
   * @param key key to assign to the data in the LocalStorage.
   * @param dataValue data to set.
   */
  public setData(key: string, dataValue: any): void {
    this.storageService.setData(key, dataValue);
  }

  /**
   * Checking for existence of specific key.
   * @param key key to check.
   */
  public checkIfExist(key: string): boolean {
    return this.storageService.checkIsExist(key);
  }

  /**
   * Removes all items from the LocalStorage.
   */
  public destroy(): void {
    this.storageService.destroy();
  }

  /**
   * Removes one or more items from the LocalStorage.
   * @param keys keys of the items to remove.
   */
  public removeItems(...keys: string[]): void {
    this.storageService.removeItems(keys);
  }

  /**
   * Check if value from the LocalStorage is valid. It means that it is different the "undefine" or "null".
   * @param key keys of the items to remove.
   */
  public checkDataIsValid(key: string): boolean {
    return this.storageService.checkDataIsValid(key);
  }
}
