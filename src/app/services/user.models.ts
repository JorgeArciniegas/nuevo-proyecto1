import { AccountDetails, AccountOperatorDetails, CouponLimit } from "@elys/elys-api";

export interface OperatorData {
  ClientId: number;
  BusinessName: string;
  isAdminLogged: boolean;
}


export interface DataUser {
  userDetail?: AccountDetails;
  operatorDetail?: AccountOperatorDetails;
  productIsLoaded?: boolean;
  couponLimit?: CouponLimit;

}


export interface LoginDataDirect {
  token: string;
  loginType: LOGIN_TYPE;
  language: string;
}


export enum TYPE_ACCOUNT {
  ADMIN,
  OPERATOR
}

export enum LOGIN_TYPE {
  WEB,
  RETAIL,
  OPERATOR,
  ASKFOROPERATORLOGIN
}
