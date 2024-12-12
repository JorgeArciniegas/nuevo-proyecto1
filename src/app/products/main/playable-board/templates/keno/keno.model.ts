export interface KenoNumber {
  number: number;
  isSelected: boolean;
}

export interface KenoNumberNative extends KenoNumber {
  row: number;
  col: number;
}
