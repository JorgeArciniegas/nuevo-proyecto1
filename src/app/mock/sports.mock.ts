import { AccountVirtualSport, VirtualProgramTreeBySportResponse, VirtualSportLastResultsResponse } from '@elys/elys-api';
import { EventsList } from '../products/main/events-list/event-list.model';
import { EventDetail, VirtualBetTournamentExtended } from '../products/main/main.models';
import { mockEvId, mockVirtualBetEvent } from './virtual-bet-event.mock';

export const mockTsMft: string = 'F2';

export const mockTsMftSoccer: string = 'F6';

export const mockFirstEvId: number = mockEvId;

export const mockFirstEvIdSoccer: number = 21270764;

export const mockFirstEvDuration: number = 120;

export const mockFirstDurationSoccer: number = 360;

export const mockAccountVirtualSport: AccountVirtualSport[] = [
	{
		SportId: 8,
		SportName: 'DogRacing',
		VirtualCategories: [
			{
				Name: 'Dog Racing',
				Code: 'DOG'
			}
		]
	},
	{
		SportId: 10,
		SportName: 'HorseRacing',
		VirtualCategories: [
			{
				Name: 'Horse Racing',
				Code: 'HORSE'
			}
		]
	},
	{
		SportId: 210,
		SportName: 'VirtualHorse',
		VirtualCategories: [
			{
				Name: 'Virtual Horse',
				Code: 'HORSE-VIRT'
			}
		]
	},
	{
		SportId: 1,
		SportName: 'Soccer',
		VirtualCategories: [
			{
				Name: 'Italian League',
				Code: 'ITA-LEAGUE'
			},
			{
				Name: 'England League',
				Code: 'ENG-LEAGUE'
			}
		]
	},
	{
		SportId: 18,
		SportName: 'Keno',
		VirtualCategories: [
			{
				Name: 'Keno 80',
				Code: 'KENO'
			}
		]
	},
	{
		SportId: 20,
		SportName: 'CockRacing',
		VirtualCategories: [
			{
				Name: 'Cock Fighting',
				Code: 'COCK'
			}
		]
	},
	// {
	// 	SportId: 21,
	// 	SportName: 'Roulette',
	// 	VirtualCategories: [
	// 		{
	// 			Name: 'American Roulette',
	// 			Code: 'ARLT'
	// 		}
	// 	]
	// },
	{
		SportId: 24,
		SportName: 'Colors',
		VirtualCategories: [
			{
				Name: 'Colors',
				Code: 'CLRS'
			}
		]
	}
]

export const mockVirtualBetTournamentExtended: VirtualBetTournamentExtended = {
	'id': 21252205,
	'pn': null,
	'pid': 21252204,
	'nm': 'Tournament DogRacing',
	'sdt': '2022-08-18T06:00:00',
	'edt': new Date('2022-08-19T06:00:00'),
	'sdtoffset': new Date('2022-08-18T06:00:00+02:00'),
	'cdt': -138302951981,
	'ec': 12,
	'duration': 120,
	'mft': mockTsMft,
	'evs': [
		mockVirtualBetEvent,
		{
			'id': 21254748,
			'nm': 'Race n. 234',
			'mk': [],
			'sdt': '2022-08-18T09:53:00',
			'edt': new Date('2022-08-18T09:53:00'),
			'sdtoffset': new Date('2022-08-18T09:53:00+02:00'),
			'cdt': 1497048006,
			'tm': [],
			'smc': 5784,
			'st': 1,
			'ehv': false,
			//'mft': 'F1:F2:F3:F6:',
			'duration': 120
		},
		{
			'id': 21254750,
			'nm': 'Race n. 236',
			'mk': [],
			'sdt': '2022-08-18T09:55:00',
			'edt': new Date('2022-08-18T09:55:00'),
			'sdtoffset': new Date('2022-08-18T09:55:00+02:00'),
			'cdt': 2697048004,
			'tm': [],
			'smc': 5798,
			'st': 1,
			'ehv': false,
			//'mft': 'F1:F2:F4:',
			'duration': 120
		},
		{
			'id': 21254752,
			'nm': 'Race n. 238',
			'mk': [],
			'sdt': '2022-08-18T09:57:00',
			'edt': new Date('2022-08-18T09:57:00'),
			'sdtoffset': new Date('2022-08-18T09:57:00+02:00'),
			'cdt': 3897048002,
			'tm': [],
			'smc': 5812,
			'st': 1,
			'ehv': false,
			//'mft': 'F1:F2:',
			'duration': 120
		},
		{
			'id': 21254754,
			'nm': 'Race n. 240',
			'mk': [],
			'sdt': '2022-08-18T09:59:00',
			'edt': new Date('2022-08-18T09:59:00'),
			'sdtoffset': new Date('2022-08-18T09:59:00+02:00'),
			'cdt': 5097048001,
			'tm': [],
			'smc': 5826,
			'st': 1,
			'ehv': false,
			//'mft': 'F1:F2:F3:F4:F5:F6:',
			'duration': 120
		},
		{
			'id': 21254832,
			'nm': 'Race n. 242',
			'mk': [],
			'sdt': '2022-08-18T10:01:00',
			'edt': new Date('2022-08-18T10:01:00'),
			'sdtoffset': new Date('2022-08-18T10:01:00+02:00'),
			'cdt': 6297047999,
			'tm': [],
			'smc': 6142,
			'st': 1,
			'ehv': false,
			//'mft': 'F1:F2:',
			'duration': 120
		},
		{
			'id': 21254840,
			'nm': 'Race n. 244',
			'mk': [],
			'sdt': '2022-08-18T10:03:00',
			'edt': new Date('2022-08-18T10:03:00'),
			'sdtoffset': new Date('2022-08-18T10:03:00+02:00'),
			'cdt': 7497047997,
			'tm': [],
			'smc': 6174,
			'st': 1,
			'ehv': false,
			//'mft': 'F1:F2:F4:',
			'duration': 120
		},
		{
			'id': 21254842,
			'nm': 'Race n. 246',
			'mk': [],
			'sdt': '2022-08-18T10:05:00',
			'edt': new Date('2022-08-18T10:05:00'),
			'sdtoffset': new Date('2022-08-18T10:05:00+02:00'),
			'cdt': 8697047995,
			'tm': [],
			'smc': 6188,
			'st': 1,
			'ehv': false,
			//'mft': 'F1:F2:F3:F6:',
			'duration': 120
		},
		{
			'id': 21254844,
			'nm': 'Race n. 248',
			'mk': [],
			'sdt': '2022-08-18T10:07:00',
			'edt': new Date('2022-08-18T10:07:00'),
			'sdtoffset': new Date('2022-08-18T10:07:00+02:00'),
			'cdt': 9897047993,
			'tm': [],
			'smc': 6202,
			'st': 1,
			'ehv': false,
			//'mft': 'F1:F2:F4:',
			'duration': 120
		},
		{
			'id': 21254846,
			'nm': 'Race n. 250',
			'mk': [],
			'sdt': '2022-08-18T10:09:00',
			'edt': new Date('2022-08-18T10:09:00'),
			'sdtoffset': new Date('2022-08-18T10:09:00+02:00'),
			'cdt': 11097047991,
			'tm': [],
			'smc': 6216,
			'st': 1,
			'ehv': false,
			//'mft': 'F1:F2:F5:',
			'duration': 120
		},
		{
			'id': 21254942,
			'nm': 'Race n. 252',
			'mk': [],
			'sdt': '2022-08-18T10:11:00',
			'edt': new Date('2022-08-18T10:11:00'),
			'sdtoffset': new Date('2022-08-18T10:11:00+02:00'),
			'cdt': 12297047989,
			'tm': [],
			'smc': 6580,
			'st': 1,
			'ehv': false,
			//'mft': 'F1:F2:F3:F4:F6:',
			'duration': 120
		},
		{
			'id': 21254944,
			'nm': 'Race n. 254',
			'mk': [],
			'sdt': '2022-08-18T10:13:00',
			'edt': new Date('2022-08-18T10:13:00'),
			'sdtoffset': new Date('2022-08-18T10:13:00+02:00'),
			'cdt': 13497047987,
			'tm': [],
			'smc': 6594,
			'st': 1,
			'ehv': false,
			//'mft': 'F1:F2:',
			'duration': 120
		}
	]
}

export const mockTournamentDetails: VirtualBetTournamentExtended = {
	cdt: 3491804152,
	duration: mockFirstDurationSoccer,
	ec: 0,
	edt: "2022-08-19T09:52:00" as any,
	evs: [],
	id: mockFirstEvIdSoccer,
	listDetailAreas: [
	  [
	   {
		id: 1,
		isSelected: false,
		layoutDefinition: {areaCols: 1, areaMaxMarketColsByCol: [6], areaRowsByCol: [4]},
		markets: [
		  {
			hasSpecialValue: false,
			id: 10,
			layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 3, marketRows: 1},
			name: "1X2",
			selectionCount: 3,
			selections: [
			  {id: 578585731, nm: '1', tp: 1, ods: [{vl: 1.35, st: 1}], isValid: true},
			  {id: 578585732, nm: 'X', tp: 2, ods: [{vl: 4.19, st: 1}], isValid: true},
			  {id: 578585733, nm: '2', tp: 3, ods: [{vl: 5.78, st: 1}], isValid: true}
			],
			specialValueOrSpread: ""
		  },
		  {
			hasSpecialValue: true,
			id: 60,
			layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 2, marketRows: 1},
			name: "Over/Under",
			selectionCount: 2,
			selections: [
			  {id: 578585799, nm: 'Over', tp: 1, ods: [{vl: 1.57, st: 1}], isValid: true},
			  {id: 578585800, nm: 'Under', tp: 2, ods: [{vl: 1.94, st: 1}], isValid: true}
			],
			specialValueOrSpread: "2.5"
		  },
		  {
			hasSpecialValue: false,
			id: 46,
			layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 3, marketRows: 1},
			name: "DoubleChance",
			selectionCount: 3,
			selections: [
			  {id: 578585794, nm: '1X', tp: 1, ods: [{vl: 1.02, st: 1}], isValid: false},
			  {id: 578585795, nm: '12', tp: 2, ods: [{vl: 1.1, st: 1}], isValid: true},
			  {id: 578585796, nm: 'X2', tp: 3, ods: [{vl: 2.43, st: 1}], isValid: true}
			],
			specialValueOrSpread: ""
		  },
		  {
			hasSpecialValue: false,
			id: 43,
			layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 2, marketRows: 1},
			name: "Goal/NoGoal",
			selectionCount: 2,
			selections: [
			  {id: 578585783, nm: 'GG', tp: 1, ods: [{vl: 1.69, st: 1}], isValid: true},
			  {id: 578585784, nm: 'NG', tp: 2, ods: [{vl: 1.79, st: 1}], isValid: true}
			],
			specialValueOrSpread: ""
		  }
		],
		name: "Main"
	   },
	   {
		hasLowestOdd: true,
		id: 2,
		isSelected: false,
		layoutDefinition: {
		  areaCols: 2,
		  areaMaxMarketColsByCol: [2, 2],
		  areaRowsByCol: [4, 8],
		},
		markets: [
		  {
			hasSpecialValue: true,
			id: 60,
			layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 2, marketRows: 1},
			name: "Over/Under",
			selectionCount: 2,
			selections: [
			  {id: 578585797, nm: 'Over', tp: 1, ods: [{vl: 1.07, st: 1}], isValid: true, isLowestOdd: true},
			  {id: 578585798, nm: 'Under', tp: 2, ods: [{vl: 4.61, st: 1}], isValid: true}
			],
			specialValueOrSpread: "1.5"
		  },
		  {
			hasSpecialValue: true,
			id: 60,
			layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 2, marketRows: 1},
			name: "Over/Under",
			selectionCount: 2,
			selections: [
			  {id: 578585799, nm: 'Over', tp: 1, ods: [{vl: 1.57, st: 1}], isValid: true},
			  {id: 578585800, nm: 'Under', tp: 2, ods: [{vl: 1.94, st: 1}], isValid: true}
			],
			specialValueOrSpread: "2.5"
		  },
		  {
			hasSpecialValue: true,
			id: 60,
			layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 2, marketRows: 1},
			name: "Over/Under",
			selectionCount: 2,
			selections: [
			  {id: 578585801, nm: 'Over', tp: 1, ods: [{vl: 3.01, st: 1}], isValid: true},
			  {id: 578585802, nm: 'Under', tp: 2, ods: [{vl: 1.22, st: 1}], isValid: true}
			],
			specialValueOrSpread: "3.5"
		  },
		  {
			hasSpecialValue: true,
			id: 60,
			layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 2, marketRows: 1},
			name: "Over/Under",
			selectionCount: 2,
			selections: [
			  {id: 578585803, nm: 'Over', tp: 1, ods: [{vl: 7.65, st: 1}], isValid: true},
			  {id: 578585804, nm: 'Under', tp: 2, ods: [{vl: 0.98, st: 1}], isValid: false}
			],
			specialValueOrSpread: "4.5"
		  },
		  {
			hasSpecialValue: true,
			id: 22,
			layoutGridDefinition: {marketPositionOnColArea: 2, marketCols: 2, marketRows: 1},
			name: "HomeO/U",
			selectionCount: 2,
			selections: [
			  {id: 578585743, nm: 'Over', tp: 1, ods: [{vl: 0.96, st: 1}], isValid: false},
			  {id: 578585744, nm: 'Under', tp: 2, ods: [{vl: 9.67, st: 1}], isValid: true}
			],
			specialValueOrSpread: "0.5"
		  },
		  {
			hasSpecialValue: true,
			id: 22,
			layoutGridDefinition: {marketPositionOnColArea: 2, marketCols: 2, marketRows: 1},
			name: "HomeO/U",
			selectionCount: 2,
			selections: [
			  {id: 578585745, nm: 'Over', tp: 1, ods: [{vl: 1.38, st: 1}], isValid: true},
			  {id: 578585746, nm: 'Under', tp: 2, ods: [{vl: 2.34, st: 1}], isValid: true}
			],
			specialValueOrSpread: "1.5"
		  },
		  {
			hasSpecialValue: true,
			id: 22,
			layoutGridDefinition: {marketPositionOnColArea: 2, marketCols: 2, marketRows: 1},
			name: "HomeO/U",
			selectionCount: 2,
			selections: [
			  {id: 578585747, nm: 'Over', tp: 1, ods: [{vl: 3.22, st: 1}], isValid: true},
			  {id: 578585748, nm: 'Under', tp: 2, ods: [{vl: 1.19, st: 1}], isValid: true}
			],
			specialValueOrSpread: "2.5"
		  },
		  {
			hasSpecialValue: true,
			id: 22,
			layoutGridDefinition: {marketPositionOnColArea: 2, marketCols: 2, marketRows: 1},
			name: "HomeO/U",
			selectionCount: 2,
			selections: [
			  {id: 578585749, nm: 'Over', tp: 1, ods: [{vl: 16.3, st: 1}], isValid: true},
			  {id: 578585750, nm: 'Under', tp: 2, ods: [{vl: 0.92, st: 1}], isValid: false}
			],
			specialValueOrSpread: "3.5"
		  },
		  {
			hasSpecialValue: true,
			id: 23,
			layoutGridDefinition: {marketPositionOnColArea: 2, marketCols: 2, marketRows: 1},
			name: "AwayO/U",
			selectionCount: 2,
			selections: [
			  {id: 578585751, nm: 'Over', tp: 1, ods: [{vl: 1.54, st: 1}], isValid: true},
			  {id: 578585752, nm: 'Under', tp: 2, ods: [{vl: 2, st: 1}], isValid: true}
			],
			specialValueOrSpread: "0.5"
		  },
		  {
			hasSpecialValue: true,
			id: 23,
			layoutGridDefinition: {marketPositionOnColArea: 2, marketCols: 2, marketRows: 1},
			name: "AwayO/U",
			selectionCount: 2,
			selections: [
			  {id: 578585753, nm: 'Over', tp: 1, ods: [{vl: 3.3, st: 1}], isValid: true},
			  {id: 578585754, nm: 'Under', tp: 2, ods: [{vl: 1.18, st: 1}], isValid: true}
			],
			specialValueOrSpread: "1.5"
		  },
		  {
			hasSpecialValue: true,
			id: 23,
			layoutGridDefinition: {marketPositionOnColArea: 2, marketCols: 2, marketRows: 1},
			name: "AwayO/U",
			selectionCount: 2,
			selections: [
			  {id: 578585755, nm: 'Over', tp: 1, ods: [{vl: 13.66, st: 1}], isValid: true},
			  {id: 578585756, nm: 'Under', tp: 2, ods: [{vl: 0.93, st: 1}], isValid: false}
			],
			specialValueOrSpread: "2.5"
		  },
		  {
			hasSpecialValue: true,
			id: 23,
			layoutGridDefinition: {marketPositionOnColArea: 2, marketCols: 2, marketRows: 1},
			name: "AwayO/U",
			selectionCount: 2,
			selections: [
			  {id: 578585757, nm: 'Over', tp: 1, ods: [{vl: 69.13, st: 1}], isValid: true},
			  {id: 578585758, nm: 'Under', tp: 2, ods: [{vl: 0.88, st: 1}], isValid: false}
			],
			specialValueOrSpread: "3.5"
		  }
		],
		name: "Over/Under"
	   }
	  ],
	  [
		{
		 id: 1,
		 isSelected: false,
		 layoutDefinition: {areaCols: 1, areaMaxMarketColsByCol: [6], areaRowsByCol: [4]},
		 markets: [
		   {
			 hasSpecialValue: false,
			 id: 10,
			 layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 3, marketRows: 1},
			 name: "1X2",
			 selectionCount: 3,
			 selections: [
			   {id: 578585731, nm: '1', tp: 1, ods: [{vl: 1.35, st: 1}], isValid: true},
			   {id: 578585732, nm: 'X', tp: 2, ods: [{vl: 4.19, st: 1}], isValid: true},
			   {id: 578585733, nm: '2', tp: 3, ods: [{vl: 5.78, st: 1}], isValid: true}
			 ],
			 specialValueOrSpread: ""
		   },
		   {
			 hasSpecialValue: true,
			 id: 60,
			 layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 2, marketRows: 1},
			 name: "Over/Under",
			 selectionCount: 2,
			 selections: [
			   {id: 578585799, nm: 'Over', tp: 1, ods: [{vl: 1.57, st: 1}], isValid: true},
			   {id: 578585800, nm: 'Under', tp: 2, ods: [{vl: 1.94, st: 1}], isValid: true}
			 ],
			 specialValueOrSpread: "2.5"
		   },
		   {
			 hasSpecialValue: false,
			 id: 46,
			 layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 3, marketRows: 1},
			 name: "DoubleChance",
			 selectionCount: 3,
			 selections: [
			   {id: 578585794, nm: '1X', tp: 1, ods: [{vl: 1.02, st: 1}], isValid: false},
			   {id: 578585795, nm: '12', tp: 2, ods: [{vl: 1.1, st: 1}], isValid: true},
			   {id: 578585796, nm: 'X2', tp: 3, ods: [{vl: 2.43, st: 1}], isValid: true}
			 ],
			 specialValueOrSpread: ""
		   },
		   {
			 hasSpecialValue: false,
			 id: 43,
			 layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 2, marketRows: 1},
			 name: "Goal/NoGoal",
			 selectionCount: 2,
			 selections: [
			   {id: 578585783, nm: 'GG', tp: 1, ods: [{vl: 1.69, st: 1}], isValid: true},
			   {id: 578585784, nm: 'NG', tp: 2, ods: [{vl: 1.79, st: 1}], isValid: true}
			 ],
			 specialValueOrSpread: ""
		   }
		 ],
		 name: "Main"
		},
		{
		 hasLowestOdd: true,
		 id: 2,
		 isSelected: false,
		 layoutDefinition: {
		   areaCols: 2,
		   areaMaxMarketColsByCol: [2, 2],
		   areaRowsByCol: [4, 8],
		 },
		 markets: [
		   {
			 hasSpecialValue: true,
			 id: 60,
			 layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 2, marketRows: 1},
			 name: "Over/Under",
			 selectionCount: 2,
			 selections: [
			   {id: 578585797, nm: 'Over', tp: 1, ods: [{vl: 1.07, st: 1}], isValid: true, isLowestOdd: true},
			   {id: 578585798, nm: 'Under', tp: 2, ods: [{vl: 4.61, st: 1}], isValid: true}
			 ],
			 specialValueOrSpread: "1.5"
		   },
		   {
			 hasSpecialValue: true,
			 id: 60,
			 layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 2, marketRows: 1},
			 name: "Over/Under",
			 selectionCount: 2,
			 selections: [
			   {id: 578585799, nm: 'Over', tp: 1, ods: [{vl: 1.57, st: 1}], isValid: true},
			   {id: 578585800, nm: 'Under', tp: 2, ods: [{vl: 1.94, st: 1}], isValid: true}
			 ],
			 specialValueOrSpread: "2.5"
		   },
		   {
			 hasSpecialValue: true,
			 id: 60,
			 layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 2, marketRows: 1},
			 name: "Over/Under",
			 selectionCount: 2,
			 selections: [
			   {id: 578585801, nm: 'Over', tp: 1, ods: [{vl: 3.01, st: 1}], isValid: true},
			   {id: 578585802, nm: 'Under', tp: 2, ods: [{vl: 1.22, st: 1}], isValid: true}
			 ],
			 specialValueOrSpread: "3.5"
		   },
		   {
			 hasSpecialValue: true,
			 id: 60,
			 layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 2, marketRows: 1},
			 name: "Over/Under",
			 selectionCount: 2,
			 selections: [
			   {id: 578585803, nm: 'Over', tp: 1, ods: [{vl: 7.65, st: 1}], isValid: true},
			   {id: 578585804, nm: 'Under', tp: 2, ods: [{vl: 0.98, st: 1}], isValid: false}
			 ],
			 specialValueOrSpread: "4.5"
		   },
		   {
			 hasSpecialValue: true,
			 id: 22,
			 layoutGridDefinition: {marketPositionOnColArea: 2, marketCols: 2, marketRows: 1},
			 name: "HomeO/U",
			 selectionCount: 2,
			 selections: [
			   {id: 578585743, nm: 'Over', tp: 1, ods: [{vl: 0.96, st: 1}], isValid: false},
			   {id: 578585744, nm: 'Under', tp: 2, ods: [{vl: 9.67, st: 1}], isValid: true}
			 ],
			 specialValueOrSpread: "0.5"
		   },
		   {
			 hasSpecialValue: true,
			 id: 22,
			 layoutGridDefinition: {marketPositionOnColArea: 2, marketCols: 2, marketRows: 1},
			 name: "HomeO/U",
			 selectionCount: 2,
			 selections: [
			   {id: 578585745, nm: 'Over', tp: 1, ods: [{vl: 1.38, st: 1}], isValid: true},
			   {id: 578585746, nm: 'Under', tp: 2, ods: [{vl: 2.34, st: 1}], isValid: true}
			 ],
			 specialValueOrSpread: "1.5"
		   },
		   {
			 hasSpecialValue: true,
			 id: 22,
			 layoutGridDefinition: {marketPositionOnColArea: 2, marketCols: 2, marketRows: 1},
			 name: "HomeO/U",
			 selectionCount: 2,
			 selections: [
			   {id: 578585747, nm: 'Over', tp: 1, ods: [{vl: 3.22, st: 1}], isValid: true},
			   {id: 578585748, nm: 'Under', tp: 2, ods: [{vl: 1.19, st: 1}], isValid: true}
			 ],
			 specialValueOrSpread: "2.5"
		   },
		   {
			 hasSpecialValue: true,
			 id: 22,
			 layoutGridDefinition: {marketPositionOnColArea: 2, marketCols: 2, marketRows: 1},
			 name: "HomeO/U",
			 selectionCount: 2,
			 selections: [
			   {id: 578585749, nm: 'Over', tp: 1, ods: [{vl: 16.3, st: 1}], isValid: true},
			   {id: 578585750, nm: 'Under', tp: 2, ods: [{vl: 0.92, st: 1}], isValid: false}
			 ],
			 specialValueOrSpread: "3.5"
		   },
		   {
			 hasSpecialValue: true,
			 id: 23,
			 layoutGridDefinition: {marketPositionOnColArea: 2, marketCols: 2, marketRows: 1},
			 name: "AwayO/U",
			 selectionCount: 2,
			 selections: [
			   {id: 578585751, nm: 'Over', tp: 1, ods: [{vl: 1.54, st: 1}], isValid: true},
			   {id: 578585752, nm: 'Under', tp: 2, ods: [{vl: 2, st: 1}], isValid: true}
			 ],
			 specialValueOrSpread: "0.5"
		   },
		   {
			 hasSpecialValue: true,
			 id: 23,
			 layoutGridDefinition: {marketPositionOnColArea: 2, marketCols: 2, marketRows: 1},
			 name: "AwayO/U",
			 selectionCount: 2,
			 selections: [
			   {id: 578585753, nm: 'Over', tp: 1, ods: [{vl: 3.3, st: 1}], isValid: true},
			   {id: 578585754, nm: 'Under', tp: 2, ods: [{vl: 1.18, st: 1}], isValid: true}
			 ],
			 specialValueOrSpread: "1.5"
		   },
		   {
			 hasSpecialValue: true,
			 id: 23,
			 layoutGridDefinition: {marketPositionOnColArea: 2, marketCols: 2, marketRows: 1},
			 name: "AwayO/U",
			 selectionCount: 2,
			 selections: [
			   {id: 578585755, nm: 'Over', tp: 1, ods: [{vl: 13.66, st: 1}], isValid: true},
			   {id: 578585756, nm: 'Under', tp: 2, ods: [{vl: 0.93, st: 1}], isValid: false}
			 ],
			 specialValueOrSpread: "2.5"
		   },
		   {
			 hasSpecialValue: true,
			 id: 23,
			 layoutGridDefinition: {marketPositionOnColArea: 2, marketCols: 2, marketRows: 1},
			 name: "AwayO/U",
			 selectionCount: 2,
			 selections: [
			   {id: 578585757, nm: 'Over', tp: 1, ods: [{vl: 69.13, st: 1}], isValid: true},
			   {id: 578585758, nm: 'Under', tp: 2, ods: [{vl: 0.88, st: 1}], isValid: false}
			 ],
			 specialValueOrSpread: "3.5"
		   }
		 ],
		 name: "Over/Under"
		}
	  ],
	] as any,
	matches: [
	  {
		hasOddsSelected: false,
		id: 21270765,
		isDetailOpened: false,
		isVideoShown: false,
		name: "WHU - LEE",
		selectedOdds: [],
		smartcode: 7941,
		virtualBetCompetitor: [
		  {
			ac: [4, 3],
			ff: 10,
			id: 3577,
			ito: 1,
			lrrs: "",
			nm: "WHU",
			smc: 7942
		  },
		  {
			ac: [2, 1],
			ff: 7,
			id: 4885,
			ito: 2,
			lrrs: "",
			nm: "LEE",
			smc: 7943
		  }
		]
	  },
	  {
		hasOddsSelected: false,
		id: 21270766,
		isDetailOpened: false,
		isVideoShown: false,
		name: "CPL - ASV",
		selectedOdds: [],
		smartcode: 7944,
		virtualBetCompetitor: [
		  {
			ac: [2, 3],
			ff: 2,
			id: 3585,
			ito: 1,
			lrrs: "",
			nm: "CPL",
			smc: 7945
		  },
		  {
			ac: [2, 2],
			ff: 1,
			id: 4879,
			ito: 2,
			lrrs: "",
			nm: "ASV",
			smc: 7946
		  }
		]
	  }
	],
	mft: mockTsMftSoccer,
	nm: "Week #36",
	overviewArea: [
	  {
		id: 0,
		layoutDefinition: { areaCols: 1, areaMaxMarketColsByCol: [7] },
		markets: [
		  {
			hasSpecialValue: false,
			id: 10,
			layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 3, marketRows: 1},
			name: "1X2",
			selectionCount: 3,
			selections: [
			  {id: 578585731, nm: '1', tp: 1, ods: Array(1), isValid: true},
			  {id: 578585732, nm: 'X', tp: 2, ods: Array(1), isValid: true},
			  {id: 578585733, nm: '2', tp: 3, ods: Array(1), isValid: true}
			],
			specialValueOrSpread: ""
		  },
		  {
			hasSpecialValue: true,
			id: 60,
			layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 2, marketRows: 1},
			name: "Over/Under",
			selectionCount: 2,
			selections: [
			  {id: 578585799, nm: 'Over', tp: 1, ods: Array(1), isValid: true},
			  {id: 578585800, nm: 'Under', tp: 2, ods: Array(1), isValid: true}
			],
			specialValueOrSpread: "2.5"
		  },
		  {
			hasSpecialValue: false,
			id: 43,
			layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 2, marketRows: 1},
			name: "Goal/NoGoal",
			selectionCount: 2,
			selections: [
			  {id: 578585783, nm: 'GG', tp: 1, ods: Array(1), isValid: true},
			  {id: 578585784, nm: 'NG', tp: 2, ods: Array(1), isValid: true}
			],
			specialValueOrSpread: ""
		  }
		],
		name: "Overview"
	  },
	  {
		id: 0,
		layoutDefinition: {areaCols: 1, areaMaxMarketColsByCol: [7]},
		markets: [
		  {
			hasSpecialValue: false,
			id: 10,
			layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 3, marketRows: 1},
			name: "1X2",
			selectionCount: 3,
			selections: [
			  {id: 578585890, nm: '1', tp: 1, ods: Array(1), isValid: true},
			  {id: 578585891, nm: 'X', tp: 2, ods: Array(1), isValid: true},
			  {id: 578585892, nm: '2', tp: 3, ods: Array(1), isValid: true}
			],
			specialValueOrSpread: ""
		  },
		  {
			hasSpecialValue: true,
			id: 60,
			layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 2, marketRows: 1},
			name: "Over/Under",
			selectionCount: 2,
			selections: [
			  {id: 578585958, nm: 'Over', tp: 1, ods: Array(1), isValid: true},
			  {id: 578585959, nm: 'Under', tp: 2, ods: Array(1), isValid: true}
			],
			specialValueOrSpread: "2.5"
		  },
		  {
			hasSpecialValue: false,
			id: 43,
			layoutGridDefinition: {marketPositionOnColArea: 1, marketCols: 2, marketRows: 1},
			name: "Goal/NoGoal",
			selectionCount: 2,
			selections: [
			  {id: 578585942, nm: 'GG', tp: 1, ods: Array(1), isValid: true},
			  {id: 578585943, nm: 'NG', tp: 2, ods: Array(1), isValid: true}
			],
			specialValueOrSpread: ""
		  }
		],
		name: "Overview"
	  }
	],
	pid: 21268808,
	pn: "English League 6",
	sdt: "2022-08-19T09:46:00",
	sdtoffset: "2022-08-19T09:46:00+02:00" as any
}

export const mockVirtualProgramTreeBySportResponse: VirtualProgramTreeBySportResponse = {
	'Sports': [
		{
			'id': 8,
			'nm': 'DogRacing',
			'ec': 1,
			'stc': 'DOG',
			'ts': [
				mockVirtualBetTournamentExtended
			]
		}
	]
}

export const mockVirtualProgramTreeBySportResponseSoccer: VirtualProgramTreeBySportResponse = {
	'Sports': [
		{
			'id': 1,
			'nm': 'Soccer',
			'ec': 4,
			'stc': 'ITA-LEAGUE',
			'ts': [
				mockTournamentDetails
			]
		}
	]
}

export const mockVirtualSportLastResultsResponse: VirtualSportLastResultsResponse = {
	EventResults: [
		{
			EventId: 21254748,
			EventName: 'Race n. 234',
			TournamentId: 21252205,
			TournamentName: 'Tournament DogRacing',
			Result: '1-6-5'
		},
		{
			EventId: 21254738,
			EventName: 'Race n. 232',
			TournamentId: 21252205,
			TournamentName: 'Tournament DogRacing',
			Result: '4-1-6'
		},
		{
			EventId: 21254640,
			EventName: 'Race n. 230',
			TournamentId: 21252205,
			TournamentName: 'Tournament DogRacing',
			Result: '6-3-5'
		},
		{
			EventId: 21254638,
			EventName: 'Race n. 228',
			TournamentId: 21252205,
			TournamentName: 'Tournament DogRacing',
			Result: '3-4-1'
		},
		{
			EventId: 21254636,
			EventName: 'Race n. 226',
			TournamentId: 21252205,
			TournamentName: 'Tournament DogRacing',
			Result: '4-5-3'
		},
		{
			EventId: 21254634,
			EventName: 'Race n. 224',
			TournamentId: 21252205,
			TournamentName: 'Tournament DogRacing',
			Result: '1-4-6'
		},
		{
			EventId: 21254623,
			EventName: 'Race n. 222',
			TournamentId: 21252205,
			TournamentName: 'Tournament DogRacing',
			Result: '2-3-4'
		},
		{
			EventId: 21254530,
			EventName: 'Race n. 220',
			TournamentId: 21252205,
			TournamentName: 'Tournament DogRacing',
			Result: '6-3-2'
		},
		{
			EventId: 21254526,
			EventName: 'Race n. 218',
			TournamentId: 21252205,
			TournamentName: 'Tournament DogRacing',
			Result: '6-5-2'
		},
		{
			EventId: 21254513,
			EventName: 'Race n. 216',
			TournamentId: 21252205,
			TournamentName: 'Tournament DogRacing',
			Result: '2-6-3'
		},
		{
			EventId: 21254510,
			EventName: 'Race n. 214',
			TournamentId: 21252205,
			TournamentName: 'Tournament DogRacing',
			Result: '3-5-6'
		},
		{
			EventId: 21254508,
			EventName: 'Race n. 212',
			TournamentId: 21252205,
			TournamentName: 'Tournament DogRacing',
			Result: '4-5-2'
		}
	]
}

export const mockEventDetails: EventDetail = {
	currentEvent: 0,
	eventTime: {minute: 1, second: 37},
	events: [
	  {number: 21322905, label: 'Race n. 856', date: new Date('Mon Aug 22 2022 21:15:00 GMT+0300 (Eastern European Summer Time)')},
	  {number: 21322907, label: 'Race n. 858', date: new Date('Mon Aug 22 2022 21:17:00 GMT+0300 (Eastern European Summer Time)')},
	  {number: 21322909, label: 'Race n. 860', date: new Date('Mon Aug 22 2022 21:19:00 GMT+0300 (Eastern European Summer Time)')},
	  {number: 21323015, label: 'Race n. 862', date: new Date('Mon Aug 22 2022 21:21:00 GMT+0300 (Eastern European Summer Time)')},
	  {number: 21323017, label: 'Race n. 864', date: new Date('Mon Aug 22 2022 21:23:00 GMT+0300 (Eastern European Summer Time)')}
	]
}

export const mockEventList: EventsList = {
  currentEvent: 0,
  events: [
    {eventLabel: 'Race n. 856', eventStart: new Date('Mon Aug 22 2022 21:15:00 GMT+0300 (за східноєвропейським літнім часом)'), eventNumber: 21322905},
    {eventLabel: 'Race n. 858', eventStart: new Date('Mon Aug 22 2022 21:17:00 GMT+0300 (за східноєвропейським літнім часом)'), eventNumber: 21322907},
    {eventLabel: 'Race n. 860', eventStart: new Date('Mon Aug 22 2022 21:19:00 GMT+0300 (за східноєвропейським літнім часом)'), eventNumber: 21322909},
    {eventLabel: 'Race n. 862', eventStart: new Date('Mon Aug 22 2022 21:21:00 GMT+0300 (за східноєвропейським літнім часом)'), eventNumber: 21323015},
    {eventLabel: 'Race n. 864', eventStart: new Date('Mon Aug 22 2022 21:23:00 GMT+0300 (за східноєвропейським літнім часом)'), eventNumber: 21323017}
  ]
}
