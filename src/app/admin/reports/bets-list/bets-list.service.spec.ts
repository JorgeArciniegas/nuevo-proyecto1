import { TestBed } from '@angular/core/testing';
import { ElysApiService } from '@elys/elys-api';
import { ElysApiServiceStub } from 'src/app/mock/stubs/elys-api.stub';
import { RouterServiceStub } from 'src/app/mock/stubs/router.stub';
import { mockUserData } from 'src/app/mock/user.mock';
import { DataUser } from 'src/app/services/user.models';
import { UserService } from 'src/app/services/user.service';
import { RouterService } from 'src/app/services/utility/router/router.service';
import { BetsListService } from './bets-list.service';
import { AppSettings } from 'src/app/app.settings';
import { Products } from 'src/environments/environment.models';
import { mockProduct } from 'src/app/mock/product.mock';
import { mockCouponSummaryCouponListResponse } from 'src/app/mock/coupon.mock';
import { cloneData } from 'src/app/mock/helpers/clone-mock.helper';

class UserServiceStub {
  dataUserDetail: DataUser = {userDetail: cloneData(mockUserData)};
  isLoggedOperator(): boolean {
    return true;
  }
};

class AppSettingsStub {
  products: Products[] = [mockProduct];
};

describe('BetsListService', () => {
  let service: BetsListService;
  let api: ElysApiServiceStub;
  let userService: UserServiceStub;
  let router: RouterServiceStub;
  let appSettings: AppSettingsStub;
  let spyGetAvailableSport: jasmine.Spy<() => void>;
  beforeEach(() => {
    api = new ElysApiServiceStub();
    userService = new UserServiceStub();
    router = new RouterServiceStub();
    appSettings = new AppSettingsStub();
    TestBed.configureTestingModule({
        imports: [],
        providers: [
          BetsListService,
          { provide: AppSettings, useValue: appSettings},
          { provide: ElysApiService, useValue: api},
          { provide: UserService, useValue: userService},
          { provide: RouterService, useValue: router},
        ],
    });
    spyGetAvailableSport = spyOn(BetsListService.prototype, 'getAvailableSport').and.callThrough();
    service = TestBed.inject(BetsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.getAvailableSport).toHaveBeenCalled();
  });

  it('should be set and get request', () => {
    const mockSportId = 0;
    const mockSportName = 'ALL';
    const mockData = [
      {prop: 'dateHasPlaced', value: true},
      {prop: 'carriedOut', value: true},
      {prop: 'dateFrom', value: new Date('2022-04-25T00:00:00')},
      {prop: 'dateTo', value: new Date('2022-04-25T00:00:00'), expectValue: new Date('2022-04-25T23:59:59.099')},
      {prop: 'pageSize', value: 3},
      {prop: 'requestedPage', value: 1},
      {prop: 'couponType', value: 1},
      {prop: 'sportId', value: mockSportId},
      {prop: 'ticketCode', value: '123'},
      {prop: 'complianceCode', value: '1234'},
      {prop: 'idAgentClient', value: 123},
    ];
    mockData.forEach(d => {
      const setValue = d.value;
      const getValue = d.expectValue ? d.expectValue : d.value;
      service[d.prop] = setValue;
      expect(service[d.prop]).toEqual(getValue);
      expect(service.request[d.prop]).toEqual(getValue);
    });
    expect(service.labelAvailableSportSelected).toBe(mockSportName);
    expect(service.sportIdSelected).toBe(mockSportId);
  });

  it('getAvailableSport() should be set availableSport', () => {
    const mockAllSport = {
      SportId: 0,
      SportName: 'ALL',
      VirtualCategories: []
    };
    const expectedAvailableSport = [
      mockAllSport,
      {
        SportId: mockProduct.sportId,
        SportName: mockProduct.name,
        VirtualCategories: []
      }
    ];
    service.availableSport = [mockAllSport];

    service.getAvailableSport();

    expect(service.availableSport).toEqual(expectedAvailableSport)
  });

  it('paginatorSize() should be decrement request.requestedPage and call getList', () => {
    const mockRequestedPage = 2;

    spyOn(service, 'getList');
    service.request.requestedPage = mockRequestedPage;

    service.paginatorSize(false);

    expect(service.request.requestedPage).toBe(mockRequestedPage - 1);
    expect(service.getList).toHaveBeenCalled();
  });

  it('paginatorSize() should be increment request.requestedPage and call getList', () => {
    const mockRequestedPage = 2;

    spyOn(service, 'getList');
    service.request.requestedPage = mockRequestedPage;
    service.betsCouponList = cloneData(mockCouponSummaryCouponListResponse);
    service.betsCouponList.TotalPages = mockRequestedPage + 1;

    service.paginatorSize(true);

    expect(service.request.requestedPage).toBe(mockRequestedPage + 1);
    expect(service.getList).toHaveBeenCalled();
  });

  it('getList() should be set betsCouponList', async () => {
    const spyGetVirtualListOfCouponByAgent = spyOn(api.reports, 'getVirtualListOfCouponByAgent').and.callThrough();

    service.getList();

    expect(router.getRouter().navigateByUrl).toHaveBeenCalledWith('admin/reports/betsList/summaryCoupons');
    await spyGetVirtualListOfCouponByAgent.calls.mostRecent().returnValue.then(() => {
      expect(service.betsCouponList).toEqual(mockCouponSummaryCouponListResponse)
    })
  });

});