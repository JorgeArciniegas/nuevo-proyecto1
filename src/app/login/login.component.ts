import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { LoginForm, TYPELOGIN } from './login.model';
import { VERSION } from '../../environments/version';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public form: FormGroup;
  public errorMessage: string | undefined;
  public showOperatorLogin: boolean;
  versionSoftware = VERSION;
  /**
   * Select a different type login
   * When connectByOperator = true, typeLoginSelected = "Admin" viceversa is "Operator"
   *
   **/
  connectByOperator: boolean;
  typeLogin: typeof TYPELOGIN = TYPELOGIN;
  typeLoginSelected: TYPELOGIN;
  constructor(public fb: FormBuilder, public readonly userService: UserService) {
    this.form = this.fb.group({
      username: [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    this.showOperatorLogin = this.userService.isAdminExist();
    this.setDataTypeConnection(this.showOperatorLogin);
  }

  public onSubmit(form: LoginForm): void {
    if (this.form.valid && !this.showOperatorLogin || this.form.valid && !this.connectByOperator) {
      this.userService.login(form.username, form.password).then(message => (this.errorMessage = message));
    } else if (this.form.valid) {
      this.userService.loginOperator(form.username, form.password).then(message => (this.errorMessage = message));
    }
  }

  removeAdmin(): void {
    this.userService.removeDataCtd();
    this.showOperatorLogin = this.userService.isAdminExist();
  }

  public valueChange(): void {
    this.errorMessage = undefined;
  }


  public changeConnectType(evt: any): void {
    this.setDataTypeConnection(evt.checked);
  }


  private setDataTypeConnection(isSelection: boolean): void {
    this.connectByOperator = isSelection;
    this.typeLoginSelected = isSelection ? TYPELOGIN.OPERATOR : TYPELOGIN.ADMIN;
  }
}
