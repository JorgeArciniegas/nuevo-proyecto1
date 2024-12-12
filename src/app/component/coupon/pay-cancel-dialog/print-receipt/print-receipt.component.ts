import { Component, OnInit } from '@angular/core';
import { Receipt } from './print-receipt.model';
import { PrintReceiptService } from './print-receipt.service';
import { AppSettings } from '../../../../app.settings';
import { UserService } from '../../../../services/user.service';
import { LICENSE_TYPE } from '../../../../../environments/environment.models';

@Component({
  selector: 'app-print-receipt',
  templateUrl: './print-receipt.component.html',
  styleUrls: ['./print-receipt.component.scss']
})
export class PrintReceiptComponent implements OnInit {
  public receipt: Receipt;
  public date: Date;
  licenseType: typeof LICENSE_TYPE = LICENSE_TYPE;
  constructor(
    private printService: PrintReceiptService,
    public appSettings: AppSettings,
    public userService: UserService
  ) { }

  ngOnInit() {
    this.receipt = this.printService.receipt;
    this.date = new Date();
  }
}
