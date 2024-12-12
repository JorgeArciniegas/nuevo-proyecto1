import { discardPeriodicTasks, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterStub } from "src/app/mock/stubs/router.stub";
import { Receipt } from "./print-receipt.model";
import { PrintReceiptService } from "./print-receipt.service";


describe('PrintReceiptService', () => {
  let service: PrintReceiptService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PrintReceiptService,
        { provide: Router, useClass: RouterStub }
      ],
    });

    var dummyElement = document.createElement('div');
    document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);
    document.getElementsByClassName = jasmine.createSpy('HTML Element').and.returnValue([dummyElement]);
    window.print = jasmine.createSpy('print');

    service = TestBed.inject(PrintReceiptService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should print receipt', fakeAsync(() => {
    const receipt: Receipt = {
      couponCode: 'code',
      isPayment: true,
      amount: 1
    };

    service.printWindow(receipt);
    tick(250);

    expect(service.receipt).toEqual(receipt);
    expect(service.printingEnabled).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['/', { outlets: { print: 'print-receipt' } }]);
    expect(window.print).toHaveBeenCalled();

    discardPeriodicTasks();
  }));

  it('should reset the router and disable print', fakeAsync(() => {
    const receipt: Receipt = {
      couponCode: 'code',
      isPayment: true,
      amount: 1
    };

    service.printWindow(receipt);
    tick(1250);

    expect(service.receipt).toEqual(undefined);
    expect(service.printingEnabled).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { print: null } }]);
  }));

});
