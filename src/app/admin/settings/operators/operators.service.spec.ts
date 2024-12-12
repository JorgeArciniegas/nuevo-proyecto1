import { TestBed } from '@angular/core/testing';
import { AccountOperator, ElysApiService, ShopOperatorRequest, UserStatus } from '@elys/elys-api';
import { cloneData } from 'src/app/mock/helpers/clone-mock.helper';
import { mockAccountGetListOperatorsResponse, mockAccountOperator } from 'src/app/mock/operators.mock';
import { ElysApiServiceStub } from 'src/app/mock/stubs/elys-api.stub';
import { mockUserData, mockUserId } from 'src/app/mock/user.mock';
import { DataUser } from 'src/app/services/user.models';
import { UserService } from 'src/app/services/user.service';
import { OperatorsService } from './operators.service';


class UserServiceStub {
  dataUserDetail: DataUser = {userDetail: cloneData(mockUserData)};
};

export function createOperators(quantity: number): AccountOperator[] {
  const operators = [];
  for (let index = 0; index < quantity; index++) {
    operators.push(mockAccountOperator)
  };
  return operators
}

describe('OperatorsService', () => {
  let service: OperatorsService;
  let api: ElysApiServiceStub;
  let userService: UserServiceStub;
  let spyInitLoad: jasmine.Spy<() => void>;
  beforeEach(() => {
    api = new ElysApiServiceStub();
    userService = new UserServiceStub();
    TestBed.configureTestingModule({
        imports: [],
        providers: [
          OperatorsService,
          { provide: ElysApiService, useValue: api},
          { provide: UserService, useValue: userService},
        ],
    });
    spyInitLoad = spyOn(OperatorsService.prototype, 'initLoad').and.callThrough();
    service = TestBed.inject(OperatorsService);

    jasmine.clock().install();
  });
  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(spyInitLoad).toHaveBeenCalled();
  });

  it('getListOfOperators() should be retrieved sorted operators', async () => {
    const expectedOperators = cloneData(mockAccountGetListOperatorsResponse).Operators.sort(
      (itemA: AccountOperator, itemB: AccountOperator) => {
        if (itemA.SubscriptionDate === itemB.SubscriptionDate) { return 0; }
        return itemA.SubscriptionDate > itemB.SubscriptionDate ? -1 : 1;
      }
    );
    const spyGetistOfOperators = spyOn(api.account, 'getistOfOperators').and.callThrough();
    spyOn(service, 'filterOperators');
    service.getListOfOperators();

    await spyGetistOfOperators.calls.mostRecent().returnValue.then(() => {
      expect(service.listOfOperators.operators).toEqual(expectedOperators);
      expect(service.listOfOperators.totalPages).toBe(1);
      expect(service.filterOperators).toHaveBeenCalled()
    })
  });

  it('createNewOperator() should be call createOperator with mockOperator', async () => {
    const fakeDate: Date = new Date('2022-04-25T00:00:00');
    const mockOperatorForm = {username: 'test1', password: '123456a', confirmPassword:'123456a'};

    jasmine.clock().mockDate(fakeDate);

    const mockOperator: ShopOperatorRequest = {
      Operator: {
        IDClient: 0,
        IsBalanceEnabled: true,
        IsFullBalanceEnabled: false,
        IsLiveEnabled: false,
        IsLiveWidgetEnabled: false,
        IsPrematchEnabled: false,
        IsPrintTransactionEnabled: true,
        IsVirtualGamesEnabled: true,
        OperatorClientType: { OperatorTypeId: 1, Description: 'new operator' },
        Password: mockOperatorForm.password,
        StakeLimit: null,
        StakeLower: null,
        UserId: mockUserId,
        UserName: mockOperatorForm.username,
        UserStatusId: UserStatus.Enabled,
        CanFilterBetListByAnotherOperator: false,
        IsSmartCodeErrorSoundEnabled: false,
        IsSmartCodeHelperEnabled: false,
        IsSmartCodeShortcutIntellisenseEnabled: false,
        SubscriptionDate: new Date(),
        SubscriptionDateOffset: null,
        OperatorContact: null,
        CanManageKiosk: false,
        IsUserRegistrationBannerEnabled: false
      }
    }
    spyOn(api.account, 'createOperator');

    await service.createNewOperator(mockOperatorForm);

    expect(api.account.createOperator).toHaveBeenCalledWith(mockOperator)
  });

  it('deleteOperator() should be call deleteOperator with mockOperatorReq', async () => {
    service.operatorMarked = mockAccountOperator;
    const mockOperatorReq = { ClientId: service.operatorMarked.IDClient };
    
    spyOn(api.account, 'deleteOperator');

    await service.deleteOperator();

    expect(api.account.deleteOperator).toHaveBeenCalledWith(mockOperatorReq)
  });

  it('updateOperator() should be call updateOperator with mockOperatorReq', async () => {
    service.operatorMarked = mockAccountOperator;
    const mockReq = { Operator: service.operatorMarked };
    const mockPassword = '123';
    
    spyOn(api.account, 'updateOperator');

    await service.updateOperator(mockPassword);

    expect(api.account.updateOperator).toHaveBeenCalledWith(mockReq)
  });

  it('initLoad() should be set listOfOperators', () => {
    const mockListOfOperators = {
      actualPages: 0,
      totalPages: 0,
      operators: null
    };
    service.initLoad();
    expect(service.listOfOperators).toEqual(mockListOfOperators)
  });

  it('filterOperators() should be paginate the list of operators', () => {
    service.listOfOperators.operators = createOperators(25);
    const testSettings = [
      {actualPages: 0, expectedLenght: 10},
      {actualPages: 1, expectedLenght: 10},
      {actualPages: 2, expectedLenght: 5},
      {actualPages: 3, expectedLenght: 0},
    ]

    testSettings.forEach(element => {
      service.listOfOperators.actualPages = element.actualPages;
      service.filterOperators();
      expect(service.listTempOperators.length).toBe(element.expectedLenght)
    });
  });

});