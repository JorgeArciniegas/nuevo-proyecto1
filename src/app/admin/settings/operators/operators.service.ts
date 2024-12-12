import { Injectable } from '@angular/core';
import {
  AccountOperator,
  CreateShopOperatorResponse,
  DeleteShopOperatorRequest,
  ElysApiService,
  ErrorStatus,
  ShopOperatorRequest,
  UserStatus,
  ShopOperatorResponse
} from '@elys/elys-api';
import { UserService } from '../../../services/user.service';
import { DataListOfOperators, OperatorCreteByForm } from './operators.model';

@Injectable()
export class OperatorsService {

  listOfOperators: DataListOfOperators;
  listTempOperators: AccountOperator[];
  rowNumber = 10;
  operatorMarked: AccountOperator;

  constructor(private userService: UserService, private elysApi: ElysApiService) {
    this.initLoad();
  }

  /**
   *
   */
  getListOfOperators(): void {
    this.elysApi.account.getistOfOperators().then(
      resp => {
        this.listOfOperators.operators = resp.Operators.sort(
          (itemA, itemB) => {
            if (itemA.SubscriptionDate === itemB.SubscriptionDate) { return 0; }
            return itemA.SubscriptionDate > itemB.SubscriptionDate ? -1 : 1;
          });
        this.pagination();
      }
    );
  }
  /**
   * Create operator
   * @param operatorForm = {username: 'test1', password: '123456a', confirmPassword:'123456a'}
   * Notes: the  parameter 'confirmPassword' from 'operatorForm'  is not used but it is required.
   */
  createNewOperator(operatorForm: OperatorCreteByForm): Promise<CreateShopOperatorResponse> {
    const operator: ShopOperatorRequest = {
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
        Password: operatorForm.password,
        StakeLimit: null,
        StakeLower: null,
        UserId: this.userService.dataUserDetail.userDetail.UserId,
        UserName: operatorForm.username,
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
    };
    return this.elysApi.account.createOperator(operator);
  }

  /**
   * Delete operator
   */
  deleteOperator(): Promise<ErrorStatus> {
    const operatorReq: DeleteShopOperatorRequest = { ClientId: this.operatorMarked.IDClient };

    return this.elysApi.account.deleteOperator(operatorReq);
  }

  /**
   * Update operator
   * @param password
   */
  updateOperator(password: string): Promise<ShopOperatorResponse> {
    this.operatorMarked.Password = password;
    const req: ShopOperatorRequest = { Operator: this.operatorMarked };
    return this.elysApi.account.updateOperator(req);
  }

  initLoad(): void {
    this.listOfOperators = {
      actualPages: 0,
      totalPages: 0,
      operators: null
    };
  }

  /**
   * Paginator
   * It define the paginator
   */
  private pagination(): void {
    if (this.listOfOperators.operators) {
      this.listOfOperators.totalPages = (this.listOfOperators.operators.length > 0)
        ? Math.ceil(this.listOfOperators.operators.length / this.rowNumber) : 0;

      this.filterOperators();
    }
  }

  /**
   * Filter and paginate the list of operators
   */
  filterOperators(): void {
    const start = this.listOfOperators.actualPages * this.rowNumber;
    let end = (this.listOfOperators.actualPages + 1) * this.rowNumber;
    if (end > this.listOfOperators.totalOperators) {
      end = this.listOfOperators.totalOperators;
    }

    this.listTempOperators = this.listOfOperators.operators.slice(start, end);
  }


}
