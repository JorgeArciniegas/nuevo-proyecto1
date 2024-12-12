import { Component, Input, OnDestroy } from '@angular/core';
import { MainService } from '../../../../../products/main/main.service';
import { UserService } from '../../../../../services/user.service';
import { SoccerService } from './soccer.service';

@Component({
  selector: 'app-playable-board-soccer',
  templateUrl: './soccer.component.html',
  styleUrls: ['./soccer.component.scss']
})
export class SoccerComponent implements OnDestroy {
  @Input()
  public rowHeight: number;

  constructor(public soccerService: SoccerService, public mainService: MainService, public userService: UserService) {
    this.soccerService.subscribeToObservables();
  }

  ngOnDestroy() {
    this.soccerService.destroySubscriptions();
  }

  // Method to open the details of the selected match
  openEventDetails(matchIndex: number): void {
    this.soccerService.openEventDetails(matchIndex);
  }
}
