import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppSettings } from '../../app.settings';
import { UserService } from '../../services/user.service';
import { LoaderService } from '../../services/utility/loader/loader.service';
import { WindowSizeService } from '../../services/utility/window-size/window-size.service';
import { DialogService } from '../dialog.service';
import { MainService } from './main.service';

@Component({
  selector: 'app-main, [app-main]',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  public rowHeight: number;
  public settings: AppSettings;

  // Lucky last random extract
  oldLucky: string;

  constructor(
    public mainService: MainService,
    public dialog: DialogService,
    public userService: UserService,
    public readonly appSettings: AppSettings,
    public loaderService: LoaderService,
    public windowSizeService: WindowSizeService
  ) {
    this.settings = appSettings;
  }
  ngOnInit() {
    this.mainService.initEvents();
    this.rowHeight = (this.windowSizeService.windowSize.columnHeight - 30 - 12) / 24;
  }

  ngOnDestroy() {
    this.mainService.destroy();
  }

    // Used to disabled tap when  playtable is blocked
    dismiss(): void {
      return;
    }

}
