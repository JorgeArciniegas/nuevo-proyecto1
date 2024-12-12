import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { DialogData } from './products.model';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  public showDialog = false;
  // public dialogData: DialogData;
  private dialogProductRef = null;
  constructor(private dialog: MatDialog, private userservice: UserService) { }

  openDialog(dialogData: DialogData) {
    this.userservice.isModalOpen = true;
    this.userservice.isBtnCalcEditable = false;
    this.dialogProductRef = this.dialog.open(ProductDialogComponent, {
      disableClose: true,
      data: dialogData
    });

  }

  closeDialog(): void {
    if (this.dialogProductRef != null) {
      this.dialogProductRef.close();
      this.userservice.isModalOpen = false;
      this.userservice.isBtnCalcEditable = true;
    }
  }
}
