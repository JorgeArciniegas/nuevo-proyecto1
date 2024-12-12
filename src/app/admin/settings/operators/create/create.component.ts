import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorStatus } from '@elys/elys-api';
import { AppSettings } from '../../../../app.settings';
import { OperatorCreteByForm } from '../operators.model';
import { OperatorsService } from '../operators.service';
import { passwordValidator } from '../password-validator';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

export class CreateComponent implements OnInit {

  form: FormGroup;
  public errorMessage: string | undefined;
  isCreated: boolean;
  constructor(
    public readonly settings: AppSettings,
    public fb: FormBuilder,
    private operatorService: OperatorsService
  ) {
    this.form = this.fb.group({
      username: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      password: [null, Validators.compose([Validators.required, passwordValidator])],
      confirmPassword: [null, Validators.compose([Validators.required, passwordValidator])],
    },
      {
        validator: this.checkPasswords
      });
  }

  ngOnInit() {
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    if (
      group.value['password'] !==
      group.value['confirmPassword']
    ) {
      group.controls['confirmPassword'].setErrors({ notSame: true });
    } else {
      group.controls['confirmPassword'].setErrors(null);
    }
    return group.controls['password'].value === group.controls['confirmPassword'].value ? null : { notSame: true };
  }

  public onSubmit(form: OperatorCreteByForm): void {
    if (this.form.valid) {
      this.operatorService.createNewOperator(form).then(
        message => {
          this.errorMessage = ErrorStatus[message.Status];

          if (message.Status === ErrorStatus.Success) {
            this.isCreated = true;
          }
        }
      );
    }
  }

  public valueChange(): void {
    this.errorMessage = undefined;
  }
}
