export class DataStaticsChart {
  STRENGTH: number;
  ENDURANCE: number;
  AGILITY: number;
  constructor(strength?: number, endurance?: number, agility?: number) {
    this.AGILITY = agility || 0;
    this.ENDURANCE = endurance || 0;
    this.STRENGTH = strength || 0;
  }
}
