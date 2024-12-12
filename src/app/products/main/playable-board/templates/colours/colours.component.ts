import { Component, Input } from '@angular/core';
import { ColourGameId } from '../../../colour-game.enum';
import { MainService } from '../../../main.service';
import { ColourGame } from './colours.models';

@Component({
  selector: 'app-playable-board-colours',
  templateUrl: './colours.component.html',
  styleUrls: ['./colours.component.scss']
})
export class ColoursComponent {
  @Input() public rowHeight: number;
  get selectedColourGameId(): ColourGameId {
    return this.mainService.selectedColourGameId;
  }

  public ColourGameId = ColourGameId;
  public colourGames: ColourGame[] = [
    { name: ColourGameId[ColourGameId.bet49].toUpperCase(), id: ColourGameId.bet49 },
    { name: ColourGameId[ColourGameId.hilo].toUpperCase(), id: ColourGameId.hilo },
    { name: ColourGameId[ColourGameId.dragon].toUpperCase(), id: ColourGameId.dragon },
    { name: ColourGameId[ColourGameId.rainbow].toUpperCase(), id: ColourGameId.rainbow },
    { name: ColourGameId[ColourGameId.totalcolour].toUpperCase(), id: ColourGameId.totalcolour },
    { name: ColourGameId[ColourGameId.betzero].toUpperCase(), id: ColourGameId.betzero },
  ];

  constructor(private mainService: MainService) { }

  public changeGame(colourGameId: ColourGameId): void {
    this.mainService.fireChangeColoursGame(colourGameId);
  }

}
