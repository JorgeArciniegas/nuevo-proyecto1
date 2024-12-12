import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { UserService } from '../../../../../src/app/services/user.service';
import { AppSettings } from '../../../app.settings';
import { WindowSizeService } from '../../../services/utility/window-size/window-size.service';
import { IconSize } from '../../model/iconSize.model';

@Component({
  selector: 'app-user-menu,[app-user-menu]',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit, OnDestroy {
  public settings: AppSettings;
  public myTime: Date = new Date();
  public notifyIcon: IconSize;
  public playableBalance: number;
  public barHeight : number;
  private myTimeSubscription: Subscription;
  constructor(
    public readonly appSettings: AppSettings,
    public userService: UserService,
    public windowSizeService: WindowSizeService
  ) {
    this.settings = appSettings;
    this.initIconsSize();
  }

  private initIconsSize(): void {
    this.barHeight =
      this.windowSizeService.windowSize.height -
      this.windowSizeService.windowSize.columnHeight;
      this.notifyIcon = new IconSize(this.barHeight * 0.6);
  }

  ngOnInit() {
    this.myTimeSubscription = interval(1000).subscribe(() => this.getTime());
  }

  ngOnDestroy(): void {
    this.myTimeSubscription.unsubscribe();
  }

  private getTime(): void {
    this.myTime = new Date();
  }
}
