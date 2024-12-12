import { ReportsAccountStatementResponse } from '@elys/elys-api';

export const mockReportsAccountStatementResponse: ReportsAccountStatementResponse = {
	TotalPages: 1,
	NumberOfTransactions: 1,
	TotalIncome: 0,
	TotalOutcome: -1,
	Transactions: [
		{
			UserTransactionId: 96814763,
			WalletTypeId: 1,
			TransactionType: 502,
			UserTransactionDate: new Date('2022-08-26T19:00:16.593'),
			UserTransactionDateOffset: new Date('2022-08-26T19:00:16.593+02:00'),
			PreviousCashBalance: 9965.71,
			Currency: 'EUR',
			Amount: -1,
			TransactionMessage: 'Bet accepted',
			CompanyId: 99,
			IssuerUserName: '',
			IssuerType: '',
			SourceUserName: null,
			SourceWalletTypeId: null,
			TargetUserName: 'MTestDev1',
			TargetWalletTypeId: 1,
			TransactionAttribute: '',
			Tax: 0,
			ReferenceId: 'V9H7UF-C7K9-6LP0SG'
		}
	]
}