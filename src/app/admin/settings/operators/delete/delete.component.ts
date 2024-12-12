import { Component, OnInit } from '@angular/core';
import { OperatorsService } from '../operators.service';
import { AppSettings } from '../../../../app.settings';
import { ErrorStatus } from '@elys/elys-api';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  isDeleted: boolean;

  constructor(
    public readonly settings: AppSettings,
    public operatorService: OperatorsService
  ) { }

  ngOnInit() {
  }


  onSubmit() {
    this.operatorService.deleteOperator().then( message =>  {
      if (message === ErrorStatus.Success)  {
        this.isDeleted = true;
      }
    });
  }

}
