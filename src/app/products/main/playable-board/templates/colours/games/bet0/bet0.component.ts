import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-playable-board-bet0',
  templateUrl: './bet0.component.html',
  styleUrls: ['./bet0.component.scss']
})
export class Bet0Component {

  @Input() public rowHeight: number;

}
