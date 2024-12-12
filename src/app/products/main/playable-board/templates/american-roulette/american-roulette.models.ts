export class AmericanRouletteRug {

  private _NumberOfRoulette: RouletteNumber[];
  public get NumberOfRoulette(): RouletteNumber[] {
    return this._NumberOfRoulette;
  }
  public set NumberOfRoulette(value: RouletteNumber[]) {
    this._NumberOfRoulette = value;
  }

  private _red = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  public get red() {
    return this._red;
  }
  public set red(value) {
    this._red = value;
  }

  private _black = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
  public get black() {
    return this._black;
  }
  public set black(value) {
    this._black = value;
  }


  private _green = ['0', '00'];
  public get green() {
    return this._green;
  }
  public set green(value) {
    this._green = value;
  }


  private _columnFirst = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
  public get columnFirst() {
    return this._columnFirst;
  }

  private _columnSecond = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
  public get columnSecond() {
    return this._columnSecond;
  }


  private _columnThird = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
  public get columnThird() {
    return this._columnThird;
  }

  constructor() {
    const numberBlack: RouletteNumber[] = this.generateNumbers(COLORS.BLACK);
    const numberRed: RouletteNumber[] = this.generateNumbers(COLORS.RED);
    this._NumberOfRoulette = numberBlack.concat(numberRed);
    this._NumberOfRoulette.sort((a, b) => a.number - b.number);
  }

  generateNumbers(color: COLORS): RouletteNumber[] {

    const tmp: RouletteNumber[] = [];
    let extraxtCol;
    if (color === COLORS.BLACK) {
      extraxtCol = this.black;

    } else if (color === COLORS.RED) {
      extraxtCol = this.red;
    } else if (color === COLORS.GREEN) {
      extraxtCol = this.green;
    }

    for (const i of extraxtCol) {
      tmp.push({
        color: color,
        isSelected: false,
        number: i,
        column:
          this.columnFirst.includes(i)
            ? COLUMNS_ROULETTE.FIRST
            : (this.columnSecond.includes(i)
              ? COLUMNS_ROULETTE.SECOND : COLUMNS_ROULETTE.THIRD)
      });
    }
    return tmp;
  }
}


export interface RouletteNumber {
  number: number;
  color: COLORS;
  isSelected: boolean;
  column: COLUMNS_ROULETTE;
}

export enum COLORS {
  RED,
  BLACK,
  GREEN
}

export enum COLUMNS_ROULETTE {
  FIRST,
  SECOND,
  THIRD
}
