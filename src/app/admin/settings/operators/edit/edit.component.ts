import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorStatus } from '@elys/elys-api';
import { AppSettings } from '../../../../app.settings';
import { OperatorEditByForm } from '../operators.model';
import { OperatorsService } from '../operators.service';
import { passwordValidator } from '../password-validator';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {

  form: FormGroup;
  public errorMessage: string | undefined;
  isEdited: boolean;

  constructor(
    public operatorService: OperatorsService,
    public readonly settings: AppSettings,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group(
      {
        password: [
          null,
          Validators.compose([Validators.required, passwordValidator])
        ],
        confirmPassword: [
          null,
          Validators.compose([Validators.required, passwordValidator])
        ]
      },
      {
        validator: this.checkPasswords
      }
    );
  }

  checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group
    if (
      group.value['password'] !==
      group.value['confirmPassword']
    ) {
      group.controls['confirmPassword'].setErrors({ notSame: true });
    } else {
      group.controls['confirmPassword'].setErrors(null);
    }
    return group.controls['password'].value ===
      group.controls['confirmPassword'].value ? null : { notSame: true };
  }

  onSubmit(operatorEdit: OperatorEditByForm): void {
    if (this.form.valid) {
      this.operatorService.updateOperator(operatorEdit.password).then(
        message => {
          this.errorMessage = ErrorStatus[message.Status];

          if (message.Status === ErrorStatus.Success) {
            this.isEdited = true;
          }
        }
      );
    }
  }
}
