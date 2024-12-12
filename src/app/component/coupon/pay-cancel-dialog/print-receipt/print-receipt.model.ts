export class Receipt {
  couponCode: string;
  isPayment: boolean;
  amount: number;

  constructor(couponCode: string, isPayment: boolean, amount: number) {
    this.couponCode = couponCode;
    this.isPayment = isPayment;
    this.amount = amount;
  }
}
