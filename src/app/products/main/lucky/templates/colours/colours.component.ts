import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../main.service';
import { ColourGameId } from '../../../colour-game.enum';

@Component({
  selector: 'app-lucky-colours',
  templateUrl: './colours.component.html',
  styleUrls: ['./colours.component.scss']
})
export class ColoursComponent implements OnInit {
  ColourGameId = ColourGameId;

  constructor(public mainService: MainService) { }

  ngOnInit() {
  }

}
