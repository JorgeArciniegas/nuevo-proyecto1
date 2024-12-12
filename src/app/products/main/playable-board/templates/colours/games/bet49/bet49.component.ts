import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-playable-board-bet49',
  templateUrl: './bet49.component.html',
  styleUrls: ['./bet49.component.scss']
})
export class Bet49Component {

  @Input() public rowHeight: number;
}
