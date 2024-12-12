import { AccountGetListOperatorsResponse, AccountOperator, ReportsOperatorVolumeResponse } from '@elys/elys-api';

export const mockAccountOperator: AccountOperator = {
  IDClient: 10948,
  UserName: 'testalex1',
  UserId: 569673,
  Password: null,
  UserStatusId: 1,
  OperatorClientType: {
    OperatorTypeId: 1,
    Description: 'agentclient_type_operator'
  },
  SubscriptionDate: new Date('2022-04-25T06:59:00'),
  SubscriptionDateOffset: null,
  StakeLimit: 100,
  StakeLower: 0.01,
  OperatorContact: null,
  IsPrematchEnabled: false,
  IsLiveEnabled: false,
  IsVirtualGamesEnabled: true,
  IsBalanceEnabled: true,
  IsFullBalanceEnabled: false,
  IsPrintTransactionEnabled: true,
  IsLiveWidgetEnabled: false,
  CanFilterBetListByAnotherOperator: false,
  IsSmartCodeHelperEnabled: false,
  IsSmartCodeErrorSoundEnabled: false,
  IsSmartCodeShortcutIntellisenseEnabled: false,
  IsUserRegistrationBannerEnabled: false,
  CanManageKiosk: false,
  CanPrintWithSession: false,
  OccupationLicenseNumber: null,
  ClientPolicies: null,
  Description: '',
  //TerminalId: null,
  //IsTerminalIdCommitted: false
}

export const mockAccountGetListOperatorsResponse: AccountGetListOperatorsResponse = {
	Operators: [
		mockAccountOperator,
		{
			IDClient: 11062,
			UserName: 'testalex2',
			UserId: 569673,
			Password: null,
			UserStatusId: 1,
			OperatorClientType: {
				OperatorTypeId: 1,
				Description: 'agentclient_type_operator'
			},
			SubscriptionDate: new Date('2022-05-10T14:03:00'),
			SubscriptionDateOffset: null,
			StakeLimit: 100,
			StakeLower: 0.01,
			OperatorContact: null,
			IsPrematchEnabled: false,
			IsLiveEnabled: false,
			IsVirtualGamesEnabled: true,
			IsBalanceEnabled: true,
			IsFullBalanceEnabled: false,
			IsPrintTransactionEnabled: true,
			IsLiveWidgetEnabled: false,
			CanFilterBetListByAnotherOperator: false,
			IsSmartCodeHelperEnabled: false,
			IsSmartCodeErrorSoundEnabled: false,
			IsSmartCodeShortcutIntellisenseEnabled: false,
			IsUserRegistrationBannerEnabled: false,
			CanManageKiosk: false,
			CanPrintWithSession: false,
			OccupationLicenseNumber: null,
			ClientPolicies: null,
			Description: '',
			//TerminalId: null,
			//IsTerminalIdCommitted: false
		},
		{
			IDClient: 10872,
			UserName: 'testferro1',
			UserId: 569673,
			Password: null,
			UserStatusId: 1,
			OperatorClientType: {
				OperatorTypeId: 1,
				Description: 'agentclient_type_operator'
			},
			SubscriptionDate: new Date('2022-04-07T16:08:00'),
			SubscriptionDateOffset: null,
			StakeLimit: 100,
			StakeLower: 0.01,
			OperatorContact: null,
			IsPrematchEnabled: false,
			IsLiveEnabled: false,
			IsVirtualGamesEnabled: true,
			IsBalanceEnabled: true,
			IsFullBalanceEnabled: false,
			IsPrintTransactionEnabled: true,
			IsLiveWidgetEnabled: false,
			CanFilterBetListByAnotherOperator: false,
			IsSmartCodeHelperEnabled: false,
			IsSmartCodeErrorSoundEnabled: false,
			IsSmartCodeShortcutIntellisenseEnabled: false,
			IsUserRegistrationBannerEnabled: false,
			CanManageKiosk: false,
			CanPrintWithSession: false,
			OccupationLicenseNumber: null,
			ClientPolicies: null,
			Description: '',
			//TerminalId: null,
			//IsTerminalIdCommitted: false
		},
		{
			IDClient: 10886,
			UserName: 'TestUser',
			UserId: 569673,
			Password: null,
			UserStatusId: 1,
			OperatorClientType: {
				OperatorTypeId: 1,
				Description: 'agentclient_type_operator'
			},
			SubscriptionDate: new Date('2022-04-11T09:44:00'),
			SubscriptionDateOffset: null,
			StakeLimit: 100,
			StakeLower: 0.01,
			OperatorContact: null,
			IsPrematchEnabled: false,
			IsLiveEnabled: false,
			IsVirtualGamesEnabled: true,
			IsBalanceEnabled: true,
			IsFullBalanceEnabled: false,
			IsPrintTransactionEnabled: true,
			IsLiveWidgetEnabled: false,
			CanFilterBetListByAnotherOperator: false,
			IsSmartCodeHelperEnabled: false,
			IsSmartCodeErrorSoundEnabled: false,
			IsSmartCodeShortcutIntellisenseEnabled: false,
			IsUserRegistrationBannerEnabled: false,
			CanManageKiosk: false,
			CanPrintWithSession: false,
			OccupationLicenseNumber: null,
			ClientPolicies: null,
			Description: '',
			//TerminalId: null,
			//IsTerminalIdCommitted: false
		}
	]
}

export const mockReportsOperatorVolumeResponse: ReportsOperatorVolumeResponse[] = [
	{
		IDClient: 10948,
		Username: 'testalex1',
		Stake: 6,
		Voided: 0,
		Won: 0
	},
	{
		IDClient: 11062,
		Username: 'testalex2',
		Stake: 1,
		Voided: 0,
		Won: 0
	},
	{
		IDClient: 10872,
		Username: 'testferro1',
		Stake: 0,
		Voided: 0,
		Won: 0
	},
	{
		IDClient: 10886,
		Username: 'TestUser',
		Stake: 2,
		Voided: 0,
		Won: 0
	}
]

export const mockOperatorSummary = {
	operatorVolumes: [
	  {
		IDClient: 10948,
		Username: 'testalex1',
		Stake: 6,
		Voided: 0,
		Won: 0
	  },
	  {
		IDClient: 11062,
		Username: 'testalex2',
		Stake: 1,
		Voided: 0,
		Won: 0
	  },
	  {
		IDClient: 10872,
		Username: 'testferro1',
		Stake: 0,
		Voided: 0,
		Won: 0
	  },
	  {
		IDClient: 10886,
		Username: 'TestUser',
		Stake: 2,
		Voided: 0,
		Won: 0
	  }
	],
	totalStake: 9,
	totalVoided: 0,
	totalWon: 0,
	dateFrom: new Date('2022-07-31T21:00:00.000Z'),
	dateTo: new Date('2022-08-31T20:59:59.000Z'),
	dateStamp: new Date('2022-08-31T07:48:56.866Z')
};

