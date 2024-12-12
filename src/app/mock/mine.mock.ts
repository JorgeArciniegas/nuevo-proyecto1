import { VirtualGetRankByEventResponse } from '@elys/elys-api';
import { EventDetail, EventInfo, EventTime, PlacingEvent, SmartCodeType } from '../products/main/main.models';
import { Market, PolyfunctionalArea, PolyfunctionalStakeCoupon } from '../products/products.model';
import { mockFirstEvId } from './sports.mock';

export const mockCountDown: number = 1000000000;

export const mockEventTime: EventTime = {
	minute: 1,
  	second: 2,
}

export const mockFirstEventNumber: number = mockFirstEvId;

export const mockEventInfo: EventInfo[] = [
	{
		number: mockFirstEventNumber,
		label: 'event1',
		date: new Date('2022-07-11T11:42:17.93')
	},
	{
		number: 2,
		label: 'event2',
		date: new Date('2022-07-11T11:44:17.93')
	},
	{
		number: 3,
		label: 'event3',
		date: new Date('2022-07-11T11:46:17.93')
	},
]

export const mockEventDetail: EventDetail = {
	eventTime: mockEventTime,
	events: mockEventInfo,
	currentEvent: 0
}

export const mockPlayerListCleared = [
	{
	  number: 1,
	  selectable: true,
	  actived: false,
	  position: 1
	},
	{
	  number: 2,
	  selectable: true,
	  actived: false,
	  position: 1
	},
	{
	  number: 3,
	  selectable: true,
	  actived: false,
	  position: 1
	},
	{
	  number: 4,
	  selectable: true,
	  actived: false,
	  position: 1
	},
	{
	  number: 5,
	  selectable: true,
	  actived: false,
	  position: 1
	},
	{
	  number: 6,
	  selectable: true,
	  actived: false,
	  position: 1
	},
	{
	  number: 1,
	  selectable: true,
	  actived: false,
	  position: 2
	},
	{
	  number: 2,
	  selectable: true,
	  actived: false,
	  position: 2
	},
	{
	  number: 3,
	  selectable: true,
	  actived: false,
	  position: 2
	},
	{
	  number: 4,
	  selectable: true,
	  actived: false,
	  position: 2
	},
	{
	  number: 5,
	  selectable: true,
	  actived: false,
	  position: 2
	},
	{
	  number: 6,
	  selectable: true,
	  actived: false,
	  position: 2
	},
	{
	  number: 1,
	  selectable: true,
	  actived: false,
	  position: 3
	},
	{
	  number: 2,
	  selectable: true,
	  actived: false,
	  position: 3
	},
	{
	  number: 3,
	  selectable: true,
	  actived: false,
	  position: 3
	},
	{
	  number: 4,
	  selectable: true,
	  actived: false,
	  position: 3
	},
	{
	  number: 5,
	  selectable: true,
	  actived: false,
	  position: 3
	},
	{
	  number: 6,
	  selectable: true,
	  actived: false,
	  position: 3
	}
]

export const mockPlayerList = [
	{
	  number: 1,
	  selectable: false,
	  actived: true,
	  position: 1
	},
	{
	  number: 2,
	  selectable: false,
	  actived: true,
	  position: 1
	},
	{
	  number: 3,
	  selectable: false,
	  actived: true,
	  position: 1
	},
	{
	  number: 4,
	  selectable: false,
	  actived: true,
	  position: 1
	},
	{
	  number: 5,
	  selectable: false,
	  actived: true,
	  position: 1
	},
	{
	  number: 6,
	  selectable: false,
	  actived: true,
	  position: 1
	},
	{
	  number: 1,
	  selectable: false,
	  actived: true,
	  position: 2
	},
	{
	  number: 2,
	  selectable: false,
	  actived: true,
	  position: 2
	},
	{
	  number: 3,
	  selectable: false,
	  actived: true,
	  position: 2
	},
	{
	  number: 4,
	  selectable: false,
	  actived: true,
	  position: 2
	},
	{
	  number: 5,
	  selectable: false,
	  actived: true,
	  position: 2
	},
	{
	  number: 6,
	  selectable: false,
	  actived: true,
	  position: 2
	},
	{
	  number: 1,
	  selectable: false,
	  actived: true,
	  position: 3
	},
	{
	  number: 2,
	  selectable: false,
	  actived: true,
	  position: 3
	},
	{
	  number: 3,
	  selectable: false,
	  actived: true,
	  position: 3
	},
	{
	  number: 4,
	  selectable: false,
	  actived: true,
	  position: 3
	},
	{
	  number: 5,
	  selectable: false,
	  actived: true,
	  position: 3
	},
	{
	  number: 6,
	  selectable: false,
	  actived: true,
	  position: 3
	}
]

export const mockVirtualGetRankByEventResponse: VirtualGetRankByEventResponse = {
	RankRows: [
		{
			Competitor: {
				id: 3553,
				nm: 'INT',
				ito: 1
			},
			RankColumns: [
				{
					RankColumnKey: 'GOALS',
					RankColumnValue: '55'
				},
				{
					RankColumnKey: 'GOALSCON',
					RankColumnValue: '24'
				},
				{
					RankColumnKey: 'LASTRESULTS',
					RankColumnValue: 'P,V,V,N,V',
				},
				{
					RankColumnKey: 'POINTS',
					RankColumnValue: '55'
				},
				{
					RankColumnKey: 'POSTREND',
					RankColumnValue: '0'
				},
				{
					RankColumnKey: 'ROUND',
					RankColumnValue: '26'
				}
			]
		}
	]
}

export const mockPlacingEvent = {
	eventNumber: mockFirstEventNumber,
	repeat: 1,
	amount: 0,
	isSpecialBets: false,
	players: [],
	odds: [],
	secondRowDisabled: false,
	thirdRowDisabled: false
}

export const mockSmartCode = {
	selPlaced: [],
	selPodium: [],
	selWinner: []
}

export const mockPolyfunctionalArea = new PolyfunctionalArea();

export const mockPolyfunctionalStakeCoupon = new PolyfunctionalStakeCoupon();

export const mockDataTypeSelection = [
	{
	  selection: 'WINNER',
	  result: 40
	},
	{
	  selection: 'PLACED',
	  result: 5
	},
	{
	  selection: 'SHOW',
	  result: 6
	},
	{
	  selection: 'OVER',
	  result: 7
	},
	{
	  selection: 'UNDER',
	  result: 7
	},
	{
	  selection: 'EVEN',
	  result: 8
	},
	{
	  selection: 'ODD',
	  result: 8
	},
	{
	  selection: 'AO',
	  result: 9
	},
	{
	  selection: '1VA',
	  result: 9
	},
	{
	  selection: 'AOX',
	  result: 9
	},
	{
	  selection: 'AR',
	  result: 9
	},
	{
	  selection: 'T',
	  result: 12
	},
	{
	  selection: 'TOX',
	  result: 12
	},
	{
	  selection: 'TNX',
	  result: 12
	},
	{
	  selection: 'VT',
	  result: 12
	},
	{
	  selection: 'AT',
	  result: 12
	},
	{
	  selection: 'TR',
	  result: 12
	},
	{
	  selection: 'AS',
	  result: 11
	},
	{
	  selection: 'AX',
	  result: 11
	},
	{
	  selection: 'AB',
	  result: 11
	},
	{
	  selection: 'OTHER',
	  result: -1
	},
]

export const mockDataMarketIdentifier = [
	{
	  marketId: Market['1X2'],
	  result: SmartCodeType.V
	},
	{
	  marketId: Market['1X2OverUnder'],
	  result: SmartCodeType.V
	},
	{
	  marketId: Market['1X2WinningSector'],
	  result: SmartCodeType.V
	},
	{
	  marketId: Market['WinningSector'],
	  result: SmartCodeType.S
	},
	{
	  marketId: Market['OverUnder'],
	  result: SmartCodeType.OU
	},
	{
	  marketId: Market['StraightUp'],
	  result: SmartCodeType.R
	},
]

export const mockDataGenerateOdds = [
	{
		args: {
			value: '1/23',
			combinationType: 1,
			ordered: false,
			withReturn: false,
			isFirstRowFixed: undefined
		},
		result: ['1-2-3', '1-3-2']
	},
	{
		args: {
			value: '123/45',
			combinationType: 0,
			ordered: true,
			withReturn: false,
			isFirstRowFixed: undefined
		},
		result: ['1-4', '1-5', '2-4', '2-5', '3-4', '3-5']
	},
	{
		args: {
			value: '126/34/5',
			combinationType: 1,
			ordered: true,
			withReturn: true,
			isFirstRowFixed: true
		},
		result: [
			'1-3-5',
			'5-3-1',
			'1-4-5',
			'5-4-1',
			'2-3-5',
			'5-3-2',
			'2-4-5',
			'5-4-2',
			'6-3-5',
			'5-3-6',
			'6-4-5',
			'5-4-6'
		  ]
	},
]

export const mockDataGenerateOddsRow = [
	{
		args: {
			value: '123',
			combinationType: 0,
			ordered: true,
			withReturn: false,
		},
		result: ['1-2', '1-3', '2-3']
	},
	{
		args: {
			value: '123',
			combinationType: 1,
			ordered: false,
			withReturn: false,
		},
		result: ['1-2-3', '1-3-2', '2-1-3', '2-3-1', '3-1-2', '3-2-1']
	}
]


