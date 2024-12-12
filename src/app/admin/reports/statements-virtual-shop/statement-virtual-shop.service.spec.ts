import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { ElysApiService, ReportsCtdAggregatesRequest } from "@elys/elys-api";
import { cloneData } from "src/app/mock/helpers/clone-mock.helper";
import { mockReportsCtdAggregatesRequest } from "src/app/mock/statement-virtual.mock";
import { ElysApiServiceStub } from "src/app/mock/stubs/elys-api.stub";
import { mockUserData } from "src/app/mock/user.mock";
import { DataUser } from "src/app/services/user.models";
import { UserService } from "src/app/services/user.service";
import { ExcelService } from "src/app/services/utility/export/excel.service";
import { DataListOfCtdAggregate } from "./statement-virtual-shop.model";
import { StatementVirtualShopService } from "./statement-virtual-shop.service";

class UserServiceStub {
  dataUserDetail: DataUser = {userDetail: cloneData(mockUserData)};
};

class ExcelServiceStub {
  exportAsExcelFile = jasmine.createSpy('exportAsExcelFile');
}

describe('StatementVirtualShopService', () => {
  let service: StatementVirtualShopService;
  let userService: UserService;
  let excelService: ExcelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StatementVirtualShopService,
        { provide: UserService, useClass: UserServiceStub },
        { provide: ElysApiService, useClass: ElysApiServiceStub },
        { provide: ExcelService, useClass: ExcelServiceStub }
      ],
    });

    service = TestBed.inject(StatementVirtualShopService);
    userService = TestBed.inject(UserService);
    excelService = TestBed.inject(ExcelService);

    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get userId from request\'s parameters', () => {
    const userId: number = 1;

    service.UserId = userId;
    expect(service.UserId).toEqual(userId);
  });

  it('should set and get dateFrom from request\'s parameters', () => {
    const dateFrom: Date = new Date(2018, 11, 24);

    service.dateFrom = dateFrom;
    expect(service.dateFrom).toEqual(dateFrom);
  });

  it('should set and get dateTo from request\'s parameters', () => {
    const dateTo: Date = new Date(2018, 11, 24);
    const expected: Date = dateTo;
    expected.setHours(23);
    expected.setMinutes(59);
    expected.setSeconds(59);

    service.dateTo = dateTo;
    expect(service.dateTo).toEqual(expected);
  });


  it('should init data', () => {
    const fakeDate: Date = new Date();
    jasmine.clock().mockDate(fakeDate);

    const request: ReportsCtdAggregatesRequest = {
      UserId: userService.dataUserDetail.userDetail.UserId,
      FromDate: new Date(fakeDate.getFullYear(), fakeDate.getMonth(), fakeDate.getDate() - 1, 0, 0, 0),
      ToDate: new Date(fakeDate.getFullYear(), fakeDate.getMonth(), fakeDate.getDate() - 1, 23, 59, 59)
    };

    service.initData();
    expect(service.request).toEqual(request);
  });

  it('should get data', fakeAsync(() => {
    const aggregatesData = new DataListOfCtdAggregate();
    aggregatesData.actualPages = 1;
    aggregatesData.totalPages = 1;
    aggregatesData.aggregates = cloneData(mockReportsCtdAggregatesRequest);
    aggregatesData.totals = {
      MegaJackpot: 0,
      NumberOfCoupons: 3,
      ShopJackpot: 0,
      Stake: 3,
      TotalProfit: 3,
      Won: 0
    };

    service.getData();
    tick(100);

    expect(service.aggregatesData).toEqual(aggregatesData);
  }));

  it('should filter operators', () => {
    service.aggregatesData = {
      actualPages: 1,
      aggregates: cloneData(mockReportsCtdAggregatesRequest),
      totalPages: 1,
      totals: {
        MegaJackpot: 0,
        NumberOfCoupons: 3,
        ShopJackpot: 0,
        Stake: 3,
        TotalProfit: 3,
        Won: 0
      }
    };

    service.filterOperators();
    expect(service.aggregatesTempData).toEqual(service.aggregatesData.aggregates);
  });

  it('should export data', () => {
    service.aggregatesData = {
      actualPages: 1,
      aggregates: cloneData(mockReportsCtdAggregatesRequest),
      totalPages: 1,
      totals: {
        MegaJackpot: 0,
        NumberOfCoupons: 3,
        ShopJackpot: 0,
        Stake: 3,
        TotalProfit: 3,
        Won: 0
      }
    };

    service.exportData();
    expect(excelService.exportAsExcelFile).toHaveBeenCalledWith(service.aggregatesData.aggregates, 'STATEMENT_SHOP');
  });

});
