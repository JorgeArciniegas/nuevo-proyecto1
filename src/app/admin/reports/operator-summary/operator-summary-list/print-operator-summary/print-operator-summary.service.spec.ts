import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterStub } from 'src/app/mock/stubs/router.stub';
import { PrintOperatorSummaryService } from './print-operator-summary.service';
import { Router } from '@angular/router';
import { mockOperatorSummary } from 'src/app/mock/operators.mock';

describe('PrintOperatorSummaryService', () => {
  let service: PrintOperatorSummaryService;
  let router: RouterStub;

  let HTMLElements = {};

  document.getElementById = jasmine.createSpy('HTML Element').and.callFake((ID) => {
    if(!HTMLElements[ID]) {
       let newElement = document.createElement('div');
       HTMLElements[ID] = newElement;
    }
    return HTMLElements[ID];
  });
  window.print = jasmine.createSpy('print');

  beforeEach(() => {
    router = new RouterStub();
    TestBed.configureTestingModule({
        imports: [],
        providers: [
          PrintOperatorSummaryService,
          { provide: Router, useValue: router},
        ],
    });

    service = TestBed.inject(PrintOperatorSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('printWindow() should be call printer', fakeAsync(() => {
    spyOn(document.getElementById('app').classList, 'add');
    spyOn(document.getElementById('app').classList, 'remove');

    service.printWindow(mockOperatorSummary);

    expect(service.operatorSummary).toEqual(mockOperatorSummary);
    expect(service.printingEnabled).toBeTrue();
    expect(document.getElementById('app').classList.add).toHaveBeenCalledWith('isPrinting');
    expect(router.navigate).toHaveBeenCalledWith(['/', { outlets: { print: 'print-operator-summary' } }]);

    tick(1250);

    expect(window.print).toHaveBeenCalled();
    expect(document.getElementById('app').classList.remove).toHaveBeenCalledWith('isPrinting');
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { print: null } }]);
    expect(service.operatorSummary).not.toBeDefined();
    expect(service.printingEnabled).toBeFalse();
  }));

});