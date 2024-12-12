import { TestBed } from '@angular/core/testing';
import { ElysApiService } from '@elys/elys-api';
import { ElysApiServiceStub } from 'src/app/mock/stubs/elys-api.stub';
import { RouterServiceStub } from 'src/app/mock/stubs/router.stub';
import { RouterService } from 'src/app/services/utility/router/router.service';
import { TransactionsListService } from './transactions-list.service';
import { TransactionCategory } from './transactions-list.model';
import { mockReportsAccountStatementResponse } from 'src/app/mock/transaction.mock';
import { cloneData } from 'src/app/mock/helpers/clone-mock.helper';

describe('TransactionsListService', () => {
  let service: TransactionsListService;
  let api: ElysApiServiceStub;
  let router: RouterServiceStub;
  beforeEach(() => {
    api = new ElysApiServiceStub();
    router = new RouterServiceStub();
    TestBed.configureTestingModule({
        imports: [],
        providers: [
          TransactionsListService,
          { provide: ElysApiService, useValue: api},
          { provide: RouterService, useValue: router},
        ],
    });
    service = TestBed.inject(TransactionsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be set and get request', () => {
    const mockData = [
      {prop: 'transactionTypesCsv', value: TransactionCategory.BET, expectValue: undefined},
      {prop: 'dateFrom', value: new Date('2022-04-25T00:00:00')},
      {prop: 'dateTo', value: new Date('2022-04-25T00:00:00'), expectValue: new Date('2022-04-25T23:59:59')},
      {prop: 'amountFrom', value: 10},
      {prop: 'amountTo', value: 100},
      {prop: 'service', value: 'fakeService'},
      {prop: 'pageSize', value: 15},
      {prop: 'requestedPage', value: 12},
      {prop: 'userWalletType', value: 1},
    ];
    mockData.forEach(d => {
      const setValue = d.value;
      const getValue = d.expectValue ? d.expectValue : d.value;
      service[d.prop] = setValue;
      expect(service[d.prop]).toEqual(getValue);
      expect(service.request[d.prop]).toEqual(getValue);
    });
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
    service.transactionsList = cloneData(mockReportsAccountStatementResponse);
    service.transactionsList.TotalPages = mockRequestedPage + 1;

    service.paginatorSize(true);

    expect(service.request.requestedPage).toBe(mockRequestedPage + 1);
    expect(service.getList).toHaveBeenCalled();
  });

  it('getList() should be set betsCouponList', async () => {
    const spyGetTransactionsHistory = spyOn(api.reports, 'getTransactionsHistory').and.callThrough();

    service.getList();

    expect(router.getRouter().navigateByUrl).toHaveBeenCalledWith('admin/reports/transactionsList/summaryTransactions');
    await spyGetTransactionsHistory.calls.mostRecent().returnValue.then(() => {
      expect(service.transactionsList).toEqual(mockReportsAccountStatementResponse)
    })
  });

});