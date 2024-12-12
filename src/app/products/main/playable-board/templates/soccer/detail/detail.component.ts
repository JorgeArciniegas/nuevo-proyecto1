import { Component, Input } from '@angular/core';
import { SoccerService } from '../soccer.service';
import { VirtualBetSelection } from '@elys/elys-api';
import { UserService } from '../../../../../../services/user.service';
import { MainService } from '../../../../../../products/main/main.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {
  @Input()
  public rowHeight: number;

  constructor(public soccerService: SoccerService, public mainService: MainService, public userService: UserService) { }

  // Method to show the selected area. In case the button is already selected no operations will be execute.
  changeArea(areaIndex: number): void {
    this.soccerService.changeArea(areaIndex);
  }

  selectOdd(marketId: number, selection: VirtualBetSelection): void {
    this.soccerService.selectOdd(marketId, selection);
  }
}
