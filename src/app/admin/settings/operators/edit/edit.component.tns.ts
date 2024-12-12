import { Component } from '@angular/core';
import { ErrorStatus } from '@elys/elys-api';
import { TextField } from '@nativescript/core';
import { AppSettings } from '../../../../app.settings';
import { OperatorEditByForm } from '../operators.model';
import { OperatorsService } from '../operators.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {

  public errorMessage: string | undefined;
  public passwordLengthInvalid = true;
  public retryPasswordLengthInvalid = true;
  public passwordNotSame = true;
  isEdited: boolean;
  operatorEditByForm: OperatorEditByForm = { password: null, confirmPassword: null };
  constructor(
    public operatorService: OperatorsService,
    public readonly settings: AppSettings
  ) {
    this.isEdited = false;

  }

  onSubmit(): void {
    if (!this.passwordLengthInvalid && !this.retryPasswordLengthInvalid && !this.passwordNotSame) {
      this.operatorService.updateOperator(this.operatorEditByForm.password).then(
        message => {
          this.errorMessage = ErrorStatus[message.Status];

          if (message.Status === ErrorStatus.Success) {
            this.isEdited = true;
          }
        }
      );
    }
  }


  public validateLength(args, name: string, minLength: number): void {
    this.errorMessage = undefined;
    const textField = <TextField>args.object;
    if (name === 'password') {
      this.passwordLengthInvalid = textField.text.length < minLength;
      this.operatorEditByForm.password = textField.text;
    } else if (name === 'retryPassword') {
      this.retryPasswordLengthInvalid = textField.text.length < minLength;
      this.operatorEditByForm.confirmPassword = textField.text;
    }
  }


  samePassword(args, password: string): void {
    const textField = <TextField>args.object;
    if (!this.retryPasswordLengthInvalid && !this.passwordLengthInvalid) {
      this.passwordNotSame = textField.text !== password;
    }
  }
}
