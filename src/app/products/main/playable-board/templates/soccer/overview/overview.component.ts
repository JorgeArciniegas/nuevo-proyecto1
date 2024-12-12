import { Component, Input } from '@angular/core';
import { SoccerService } from '../soccer.service';
import { VirtualBetSelection } from '@elys/elys-api';
import { UserService } from '../../../../../../services/user.service';
import { MainService } from '../../../../../../products/main/main.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {
  @Input()
  public rowHeight: number;

  constructor(public soccerService: SoccerService, public mainService: MainService, public userService: UserService) { }

  selectOdd(marketId: number, selection: VirtualBetSelection): void {
    this.soccerService.selectOdd(marketId, selection);
  }
}
