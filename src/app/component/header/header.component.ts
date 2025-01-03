import { Component } from '@angular/core';
import { UserService } from '../../../../src/app/services/user.service';

@Component({
  selector: 'app-header, [app-header]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(
    public userService: UserService,
  ) { }

}
