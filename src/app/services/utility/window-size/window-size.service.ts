import { Injectable } from '@angular/core';
import { WindowSize } from './window-size.model';

@Injectable({
  providedIn: 'root'
})
export class WindowSizeService {
  public windowSize: WindowSize;

  constructor() { }


  initWindowSize(): void {
    const doc: HTMLElement = document.querySelector('html');
    const h: number = doc.offsetHeight;
    const w: number = doc.offsetWidth;
    const aspectRatio: number = w / h;
    const hgeneral = h - (h * 7) / 100;
    this.windowSize = {
      height: h,
      width: w,
      aspectRatio: aspectRatio,
      columnHeight: hgeneral
    };
  }
}
