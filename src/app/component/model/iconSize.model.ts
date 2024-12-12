export class IconSize {
  constructor(width: number, height?: number) {
    this.width = width;
    if (height) {
      this.height = height;
    } else {
      this.height = width;
    }
  }
  width: number;
  height: number;
}
