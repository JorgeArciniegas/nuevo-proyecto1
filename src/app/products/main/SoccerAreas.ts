import { Area } from './main.models';
export const overviewAreas: Area = {
  id: 0,
  name: 'Overview',
  layoutDefinition: {
    areaCols: 1,
    areaMaxMarketColsByCol: [7]
  },
  markets: [
    {
      id: 10,
      name: '1X2',
      hasSpecialValue: false,
      specialValueOrSpread: '',
      selectionCount: 3,
      selections: [],
      layoutGridDefinition: {
        marketPositionOnColArea: 1,
        marketCols: 3,
        marketRows: 1
      }
    },
    {
      id: 60,
      name: 'Over/Under',
      hasSpecialValue: true,
      specialValueOrSpread: '2.5',
      selectionCount: 2,
      selections: [],
      layoutGridDefinition: {
        marketPositionOnColArea: 1,
        marketCols: 2,
        marketRows: 1
      }
    },
    {
      id: 43,
      name: 'Goal/NoGoal',
      hasSpecialValue: false,
      specialValueOrSpread: '',
      selectionCount: 2,
      selections: [],
      layoutGridDefinition: {
        marketPositionOnColArea: 1,
        marketCols: 2,
        marketRows: 1
      }
    }
  ]
};

export const areas: Area[] = [
  {
    id: 1,
    name: 'Main',
    isSelected: true,
    layoutDefinition: {
      areaCols: 1,
      areaMaxMarketColsByCol: [6],
      areaRowsByCol: [4]
    },
    markets: [
      {
        id: 10,
        name: '1X2',
        hasSpecialValue: false,
        specialValueOrSpread: '',
        selectionCount: 3,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 1,
          marketCols: 3,
          marketRows: 1
        }
      },
      {
        id: 60,
        name: 'Over/Under',
        hasSpecialValue: true,
        specialValueOrSpread: '2.5',
        selectionCount: 2,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 1,
          marketCols: 2,
          marketRows: 1
        }
      },
      {
        id: 46,
        name: 'DoubleChance',
        hasSpecialValue: false,
        specialValueOrSpread: '',
        selectionCount: 3,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 1,
          marketCols: 3,
          marketRows: 1
        }
      },
      {
        id: 43,
        name: 'Goal/NoGoal',
        hasSpecialValue: false,
        specialValueOrSpread: '',
        selectionCount: 2,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 1,
          marketCols: 2,
          marketRows: 1
        }
      }
    ]
  },
  {
    id: 2,
    name: 'Over/Under',
    isSelected: false,
    layoutDefinition: {
      areaCols: 2,
      areaMaxMarketColsByCol: [2, 2],
      areaRowsByCol: [4, 8]
    },
    markets: [
      {
        id: 60,
        name: 'Over/Under',
        hasSpecialValue: true,
        specialValueOrSpread: '1.5',
        selectionCount: 2,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 1,
          marketCols: 2,
          marketRows: 1
        }
      },
      {
        id: 60,
        name: 'Over/Under',
        hasSpecialValue: true,
        specialValueOrSpread: '2.5',
        selectionCount: 2,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 1,
          marketCols: 2,
          marketRows: 1
        }
      },
      {
        id: 60,
        name: 'Over/Under',
        hasSpecialValue: true,
        specialValueOrSpread: '3.5',
        selectionCount: 2,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 1,
          marketCols: 2,
          marketRows: 1
        }
      },
      {
        id: 60,
        name: 'Over/Under',
        hasSpecialValue: true,
        specialValueOrSpread: '4.5',
        selectionCount: 2,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 1,
          marketCols: 2,
          marketRows: 1
        }
      },
      {
        id: 22,
        name: 'HomeO/U',
        hasSpecialValue: true,
        specialValueOrSpread: '0.5',
        selectionCount: 2,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 2,
          marketCols: 2,
          marketRows: 1
        }
      },
      {
        id: 22,
        name: 'HomeO/U',
        hasSpecialValue: true,
        specialValueOrSpread: '1.5',
        selectionCount: 2,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 2,
          marketCols: 2,
          marketRows: 1
        }
      },
      {
        id: 22,
        name: 'HomeO/U',
        hasSpecialValue: true,
        specialValueOrSpread: '2.5',
        selectionCount: 2,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 2,
          marketCols: 2,
          marketRows: 1
        }
      },
      {
        id: 22,
        name: 'HomeO/U',
        hasSpecialValue: true,
        specialValueOrSpread: '3.5',
        selectionCount: 2,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 2,
          marketCols: 2,
          marketRows: 1
        }
      },
      {
        id: 23,
        name: 'AwayO/U',
        hasSpecialValue: true,
        specialValueOrSpread: '0.5',
        selectionCount: 2,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 2,
          marketCols: 2,
          marketRows: 1
        }
      },
      {
        id: 23,
        name: 'AwayO/U',
        hasSpecialValue: true,
        specialValueOrSpread: '1.5',
        selectionCount: 2,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 2,
          marketCols: 2,
          marketRows: 1
        }
      },
      {
        id: 23,
        name: 'AwayO/U',
        hasSpecialValue: true,
        specialValueOrSpread: '2.5',
        selectionCount: 2,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 2,
          marketCols: 2,
          marketRows: 1
        }
      },
      {
        id: 23,
        name: 'AwayO/U',
        hasSpecialValue: true,
        specialValueOrSpread: '3.5',
        selectionCount: 2,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 2,
          marketCols: 2,
          marketRows: 1
        }
      }
    ]
  },
  {
    id: 3,
    name: 'HalfTime/FinalTime',
    isSelected: false,
    layoutDefinition: {
      areaCols: 1,
      areaMaxMarketColsByCol: [3],
      areaRowsByCol: [3]
    },
    markets: [
      {
        id: 44,
        name: 'HT/FT',
        hasSpecialValue: false,
        specialValueOrSpread: '',
        selectionCount: 9,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 1,
          marketCols: 3,
          marketRows: 3
        }
      }
    ]
  },
  {
    id: 4,
    name: 'Goals',
    isSelected: false,
    layoutDefinition: {
      areaCols: 2,
      areaMaxMarketColsByCol: [3, 1],
      areaRowsByCol: [3, 4]
    },
    markets: [
      {
        id: 13,
        name: 'FinalGoalsNumber',
        hasSpecialValue: false,
        specialValueOrSpread: '',
        selectionCount: 9,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 1,
          marketCols: 3,
          marketRows: 3
        }
      },
      {
        id: 658,
        name: 'TotalGoals',
        hasSpecialValue: false,
        specialValueOrSpread: '',
        selectionCount: 4,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 2,
          marketCols: 1,
          marketRows: 4
        }
      }
    ]
  },
  {
    id: 5,
    name: 'CorrectScore',
    isSelected: false,
    layoutDefinition: {
      areaCols: 1,
      areaMaxMarketColsByCol: [3],
      areaRowsByCol: [10]
    },
    markets: [
      {
        id: 2,
        name: 'CorrectScore',
        hasSpecialValue: false,
        specialValueOrSpread: '',
        selectionCount: 25,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 1,
          marketCols: 3,
          marketRows: 10
        }
      }
    ]
  },
  {
    id: 6,
    name: 'Scores1HT',
    isSelected: false,
    layoutDefinition: {
      areaCols: 1,
      areaMaxMarketColsByCol: [3],
      areaRowsByCol: [3]
    },
    markets: [
      {
        id: 1009,
        name: 'CScore1HT',
        hasSpecialValue: false,
        specialValueOrSpread: '',
        selectionCount: 9,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 1,
          marketCols: 3,
          marketRows: 3
        }
      }
    ]
  },
  {
    id: 7,
    name: 'Scores2HT',
    isSelected: false,
    layoutDefinition: {
      areaCols: 1,
      areaMaxMarketColsByCol: [3],
      areaRowsByCol: [3]
    },
    markets: [
      {
        id: 1018,
        name: 'CScore2HT',
        hasSpecialValue: false,
        specialValueOrSpread: '',
        selectionCount: 9,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 1,
          marketCols: 3,
          marketRows: 3
        }
      }
    ]
  },
  {
    id: 8,
    name: 'ComboO/U',
    isSelected: false,
    layoutDefinition: {
      areaCols: 1,
      areaMaxMarketColsByCol: [6],
      areaRowsByCol: [6]
    },
    markets: [
      {
        id: 689,
        name: '1X2+O/U',
        hasSpecialValue: true,
        specialValueOrSpread: '1.5',
        selectionCount: 6,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 1,
          marketCols: 6,
          marketRows: 1
        }
      },
      {
        id: 689,
        name: '1X2+O/U',
        hasSpecialValue: true,
        specialValueOrSpread: '2.5',
        selectionCount: 6,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 1,
          marketCols: 6,
          marketRows: 1
        }
      },
      {
        id: 689,
        name: '1X2+O/U',
        hasSpecialValue: true,
        specialValueOrSpread: '3.5',
        selectionCount: 6,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 1,
          marketCols: 6,
          marketRows: 1
        }
      },
      {
        id: 32,
        name: 'DoubleChance+O/U',
        hasSpecialValue: true,
        specialValueOrSpread: '1.5',
        selectionCount: 6,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 1,
          marketCols: 6,
          marketRows: 1
        }
      },
      {
        id: 32,
        name: 'DoubleChance+O/U',
        hasSpecialValue: true,
        specialValueOrSpread: '2.5',
        selectionCount: 6,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 1,
          marketCols: 6,
          marketRows: 1
        }
      },
      {
        id: 32,
        name: 'DoubleChance+O/U',
        hasSpecialValue: true,
        specialValueOrSpread: '3.5',
        selectionCount: 6,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 1,
          marketCols: 6,
          marketRows: 1
        }
      }
    ]
  },
  {
    id: 9,
    name: 'ComboGG/NG',
    isSelected: false,
    layoutDefinition: {
      areaCols: 2,
      areaMaxMarketColsByCol: [2, 2],
      areaRowsByCol: [3, 3]
    },
    markets: [
      {
        id: 722,
        name: '1X2+GG/NG',
        hasSpecialValue: false,
        specialValueOrSpread: '',
        selectionCount: 6,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 1,
          marketCols: 2,
          marketRows: 3
        }
      },
      {
        id: 34,
        name: 'DoubleChance+GG/NG',
        hasSpecialValue: false,
        specialValueOrSpread: '',
        selectionCount: 6,
        selections: [],
        layoutGridDefinition: {
          marketPositionOnColArea: 2,
          marketCols: 2,
          marketRows: 3
        }
      }
    ]
  }
];
