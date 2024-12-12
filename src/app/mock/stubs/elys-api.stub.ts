import {
  AccountDetails,
  AccountGetListOperatorsResponse,
  AccountOperatorDetails,
  AccountVirtualSport,
  AuthenticationShopClientAgentLoginRequest,
  CouponLimitHierarchy,
  CouponLimitHierarchyRequest,
  CouponSummaryCouponListResponse,
  CurrencyCodeRequest,
  CurrencyCodeResponse,
  DeleteShopOperatorRequest,
  ReportsAccountStatementRequest,
  ReportsAccountStatementResponse,
  ReportsCtdAggregatesRequest,
  ReportsCtdAggregatesResponse,
  ReportsOperatorVolumeRequest,
  ReportsOperatorVolumeResponse,
  ShopOperatorRequest,
  TokenDataRequest,
  TokenDataSuccess,
  VBoxConfigurations,
  VirtualCouponListByAgentRequest,
  VirtualEventCountDownRequest,
  VirtualEventCountDownResponse,
  VirtualGetRankByEventResponse,
  VirtualProgramTreeBySportRequest,
  VirtualProgramTreeBySportResponse,
  VirtualSportLastResultsRequest,
  VirtualSportLastResultsResponse} from "@elys/elys-api";
import { mockCouponLimit, mockCouponSummaryCouponListResponse, mockCurrencyCodeResponse } from "../coupon.mock";
import { cloneData } from "../helpers/clone-mock.helper";
import { mockCountDown, mockVirtualGetRankByEventResponse } from "../mine.mock";
import { mockAccountGetListOperatorsResponse, mockReportsOperatorVolumeResponse } from "../operators.mock";
import {
  mockAccountVirtualSport,
  mockVirtualProgramTreeBySportResponse,
  mockVirtualSportLastResultsResponse } from "../sports.mock";
import { mockReportsCtdAggregatesRequest } from "../statement-virtual.mock";
import { mockReportsAccountStatementResponse } from "../transaction.mock";
import {
  mockOperatorData,
  mockPassword,
  mockTokenDataSuccess,
  mockUserData,
  mockUserId,
  mockUsername } from "../user.mock";
import { mockVBoxConfigurations } from "../vbox.mock";

export class ElysApiServiceStub {
  public tokenBearer: string;
  public account = {
    getMe(): Promise<AccountDetails> {
      return new Promise((resolve, reject) => {
        resolve(mockUserData)
      })
    },
    getOperatorMe(): Promise<AccountOperatorDetails> {
      return new Promise((resolve, reject) => {
        resolve(mockOperatorData)
      })
    },
    postAccessToken(request: TokenDataRequest): Promise<TokenDataSuccess> {
      return new Promise((resolve, reject) => {
        if(request.username === mockUsername && request.password === mockPassword) {
          resolve(mockTokenDataSuccess)
        } else reject({
          error: 400,
          error_description: 'The user name or password is incorrect',
          message: 'The user name or password is incorrect'
        })
      })
    },
    clientLoginRequest(request: AuthenticationShopClientAgentLoginRequest): Promise<TokenDataSuccess> {
      return new Promise((resolve, reject) => {
        if(request.Username === mockUsername && request.Password === mockPassword && request.UserId === mockUserId) {
          resolve(mockTokenDataSuccess)
        } else reject({
          error: 400,
          error_description: 'The user name or password is incorrect',
          message: 'The user name or password is incorrect'
        })
      })
    },
    getistOfOperators(username?: string): Promise<AccountGetListOperatorsResponse> {
      return new Promise((resolve, reject) => {
        resolve(cloneData(mockAccountGetListOperatorsResponse))
      })
    },
    createOperator(request: ShopOperatorRequest): Promise<any> {
      return new Promise((resolve, reject) => {
        resolve('')
      })
    },
    deleteOperator(deleteOperatorRequest: DeleteShopOperatorRequest): Promise<any> {
      return new Promise((resolve, reject) => {
        resolve('')
      })
    },
    updateOperator(request: ShopOperatorRequest): Promise<any> {
      return new Promise((resolve, reject) => {
        resolve('')
      })
    },
  };
  public coupon = {
    getCouponLimits(request: CouponLimitHierarchyRequest): Promise<CouponLimitHierarchy[]> {
      return new Promise((resolve, reject) => {
        resolve(mockCouponLimit)
      })
    },
    getCouponRelatedCurrency(request: CurrencyCodeRequest): Promise<CurrencyCodeResponse> {
      return new Promise((resolve, reject) => {
        resolve(mockCurrencyCodeResponse)
      })
    },
    cancelCoupon: jasmine.createSpy('cancelCoupon'),
    flagAsPaidCoupon: jasmine.createSpy('flagAsPaidCoupon')
  };
  public virtual = {
    getAvailablevirtualsports(): Promise<AccountVirtualSport[]> {
      return new Promise((resolve, reject) => {
        resolve(mockAccountVirtualSport)
      })
    },
    getVirtualTreeV2(request: VirtualProgramTreeBySportRequest): Promise<VirtualProgramTreeBySportResponse> {
      return new Promise((resolve, reject) => {
        resolve(mockVirtualProgramTreeBySportResponse)
      })
    },
    getLastResult(request: VirtualSportLastResultsRequest): Promise<VirtualSportLastResultsResponse> {
      return new Promise((resolve, reject) => {
        resolve(mockVirtualSportLastResultsResponse)
      })
    },
    getCountdown(request: VirtualEventCountDownRequest): Promise<VirtualEventCountDownResponse> {
      return new Promise((resolve, reject) => {
        resolve({CountDown: mockCountDown})
      })
    },
    getRanking(eventId: number): Promise<VirtualGetRankByEventResponse> {
      return new Promise((resolve, reject) => {
        resolve(mockVirtualGetRankByEventResponse)
      })
    },
    getVboxConfiguration(): Promise<VBoxConfigurations> {
      return new Promise((resolve, reject) => {
        resolve(mockVBoxConfigurations)
      });
    },
    postVboxConfiguration: jasmine.createSpy('postVboxConfiguration')
  };
  public reports = {
    getShopClientsAggregates(request: ReportsOperatorVolumeRequest): Promise<ReportsOperatorVolumeResponse[]> {
      return new Promise((resolve, reject) => {
        resolve(mockReportsOperatorVolumeResponse)
      })
    },
    getVirtualListOfCouponByAgent(request: VirtualCouponListByAgentRequest): Promise<CouponSummaryCouponListResponse> {
      return new Promise((resolve, reject) => {
        resolve(mockCouponSummaryCouponListResponse)
      })
    },
    getTransactionsHistory(request: ReportsAccountStatementRequest): Promise<ReportsAccountStatementResponse> {
      return new Promise((resolve, reject) => {
        resolve(mockReportsAccountStatementResponse)
      })
    },
    getCtdAggregates(request: ReportsCtdAggregatesRequest): Promise<ReportsCtdAggregatesResponse[]> {
      return new Promise((resolve, reject) => {
        resolve(mockReportsCtdAggregatesRequest)
      })
    }
  }
}
