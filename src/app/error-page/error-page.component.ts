import { Component } from '@angular/core';
import { AppSettings } from '../app.settings';
import { RouterService } from '../services/utility/router/router.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent {
  constructor(public appSetting: AppSettings, private routerService: RouterService) { }

  gotoHome() {
    if (this.appSetting.loginInteractive) {
      this.routerService.getRouter().navigateByUrl('/');
    } else {
      this.routerService.callBackToBrand();
    }
  }
}
