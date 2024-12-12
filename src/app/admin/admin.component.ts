import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AppSettings } from '../app.settings';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  isAdminLogged: boolean;
  constructor(
    public userService: UserService,
    public appSettings: AppSettings
  ) {
    this.isAdminLogged = this.userService.isLoggedOperator();
  }
}
