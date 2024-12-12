import { TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { UserService } from "../services/user.service";
import { DialogService } from "./dialog.service";
import { DialogData } from "./products.model";
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { MatDialogRefStub, MatDialogStub } from "../mock/stubs/mat-dialog.stub";

class UserServiceStub {
  isModalOpen: boolean;
  isBtnCalcEditable: boolean;
}

describe('DialogService', () => {
  let service: DialogService;
  let dialog: MatDialog;
  let dialogRef: any;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DialogService,
        { provide: MatDialog, useClass: MatDialogStub},
        { provide: MatDialogRef, useClass: MatDialogRefStub},
        { provide: UserService, useClass: UserServiceStub }
      ],
    });

    service = TestBed.inject(DialogService);
    dialog = TestBed.inject(MatDialog);
    dialogRef = TestBed.inject(MatDialogRef);
    userService = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open dialog', () => {
    const dialogData: DialogData = new DialogData();

    service.openDialog(dialogData);
    expect(dialog.open).toHaveBeenCalledWith(ProductDialogComponent, {
      disableClose: true,
      data: dialogData
    });
    expect(userService.isModalOpen).toBeTrue();
    expect(userService.isBtnCalcEditable).toBeFalse();
  });

  it('should close dialog', () => {
    dialog.open = jasmine.createSpy('open').and.returnValue(dialogRef);
    service.openDialog(new DialogData());

    service.closeDialog();
    expect(dialogRef.close).toHaveBeenCalled();
    expect(userService.isModalOpen).toBeFalse();
    expect(userService.isBtnCalcEditable).toBeTrue();
  });
});
