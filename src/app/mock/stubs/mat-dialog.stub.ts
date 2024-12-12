import { of } from "rxjs";

export class MatDialogStub {
  open = jasmine.createSpy('open');
}

export class MatDialogRefStub {
  close = jasmine.createSpy('close');
  afterClosed = jasmine.createSpy('afterClosed').and.returnValue(of(true));
}
