import { AccountOperator } from '@elys/elys-api';


export interface DataListOfOperators {
  totalPages?: number;
  actualPages?: number;
  totalOperators?: number;
  operators: AccountOperator[];
}


export interface OperatorCreteByForm {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface OperatorEditByForm {
  password: string;
  confirmPassword: string;
}
