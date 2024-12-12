import { TestBed } from "@angular/core/testing";
import { ExcelService } from "./excel.service";
import * as FileSaver from 'file-saver';

describe('ExcelService', () => {
  let service: ExcelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExcelService,
      ]
    });

    service = TestBed.inject(ExcelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save excel file', () => {
    const excelFileName: string = 'STATEMENT_SHOP';
    const json: any[] = [{
      CurrencyCode: "EUR",
      MegaJackpot: 0,
      NumberOfCoupons: 1,
      Profit: 2,
      ReferenceDate: "2022-08-12T00:00:00",
      ShopJackpot: 0,
      Stake: 2,
      Won: 0
    }];


    spyOn(FileSaver, 'saveAs');
    service.exportAsExcelFile(json, excelFileName);

    expect(FileSaver.saveAs).toHaveBeenCalled();
  });

});
