import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-playable-board-dragon',
  templateUrl: './dragon.component.html',
  styleUrls: ['./dragon.component.scss']
})
export class DragonComponent {

  @Input() public rowHeight: number;

}
