import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from './app.settings';
import { Settings } from './app.settings.model';
import { UserService } from './services/user.service';
import { TranslateUtilityService } from './shared/language/translate-utility.service';
import { WindowSizeService } from './services/utility/window-size/window-size.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  settings: Settings;
  public faviconPath: string;

  constructor(
    private appSettings: AppSettings,
    private translateService: TranslateService,
    private translateUtilityService: TranslateUtilityService,
    public userService: UserService,
    private windowSizeService: WindowSizeService
  ) {
    this.settings = this.appSettings;
    this.faviconPath = this.appSettings.faviconPath;
    // Set the application language passing the browser one.
    this.translateUtilityService.initializeLanguages(this.translateService.getBrowserLang());
  }

  ngOnInit(): void {
    this.windowSizeService.initWindowSize();
    // Insert favicon's link of the specific skin
    const linkElement: HTMLLinkElement = document.createElement('link');
    linkElement.setAttribute('rel', 'icon');
    linkElement.setAttribute('type', 'image/x-icon');
    linkElement.setAttribute('href', this.faviconPath);
    if (document.head) {
      document.head.appendChild(linkElement);
    }
  }

  componentHeight: number;
  
}
