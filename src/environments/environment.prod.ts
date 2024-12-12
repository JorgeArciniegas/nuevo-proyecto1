import { Environment, LICENSE_TYPE } from './environment.models';

export const environment: Environment = {
  production: true,
  loginInteractive: true,
  // tslint:disable-next-line:max-line-length
  bookmakerDetails:
    'Lorem ipsum dolor sit amet,consectetur adipisicing elit, sed doeiusmod tempor incididunt ut labore etdolore magna aliqua.',
  license: LICENSE_TYPE.DEMO_LICENSE,
  products: [],
  couponDirectPlace: false,
  currencyDefault: 'EUR',
  showEventId: true,
  baseApiUrl: '',
  printSettings: {
    enabledPrintReceipt:{
      printLogoPayCancel : false,
      printHeaderMessage : true,
    },
    enabledPrintCoupon:{
      printLogoCoupon: true,
      printHeaderMessage : true,
      printQrCode: false,
      isEnabledReprintCoupon: true,
      isTrasmitionInfoMessageShown: false,
      hideMaxPaymentAmount: false
    }
  }
};
