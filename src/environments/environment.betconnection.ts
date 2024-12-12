import {
  Environment,
  WidgetTypeLink,
  LAYOUT_TYPE,
  LICENSE_TYPE
} from './environment.models';
import { Market } from '../app/products/products.model';

export const environment: Environment = {
  production: true,
  loginInteractive: true,
  // tslint:disable-next-line:max-line-length
  bookmakerDetails:
    'Lorem ipsum dolor sit amet,consectetur adipisicing elit, sed doeiusmod tempor incididunt ut labore etdolore magna aliqua.',
  license: LICENSE_TYPE.BETCONNECTION,
  baseApiUrl: 'https://vg-apibetconnection.vg-services.net',
  pageTitle: 'Betconnection-KIOSK',
  theme: 'betconnection',
  faviconPath: 'app/themes/skins/betconnection/image/Logo-header.png',
  currencyDefault: 'EUR',
  supportedLang: ['es', 'en', 'pt', 'ht'],
  defaultAmount: {
    PresetOne: null,
    PresetTwo: null,
    PresetThree: null,
    PresetFour: null
  },
  showEventId: true,
  couponDirectPlace: true,
  products: [
    {
      sportId: 8,
      codeProduct: 'DOG',
      name: 'DogRacing',
      label: 'DOG',
      order: 0,
      productSelected: true,
      isPlayable: true,
      layoutProducts: {
        // defines the layout type for different product group
        type: LAYOUT_TYPE.RACING,
        resultItems: 4, // items to show for last result
        nextEventItems: 5, // items to show for next events
        cacheEventsItem: 10
      },
      toolbarButton: {
        name: 'dogracing',
        icon: 'Dog',
        route: 'products/racing'
      },
      widgets: [
        {
          name: '',
          routing: 'statistic',
          typeLink: WidgetTypeLink.MODAL,
          icon: 'baseline-assessment-24px' // without extension file
        }
      ],
      typeCoupon: {
        isMultipleStake: true,
        acceptMultiStake: true,
        typeLayout: LAYOUT_TYPE.RACING
      }
    },
    {
      sportId: 10,
      codeProduct: 'HORSE',
      name: 'HorseRacing',
      label: 'HORSE',
      order: 1,
      productSelected: false,
      isPlayable: true,
      layoutProducts: {
        type: LAYOUT_TYPE.RACING,
        resultItems: 4,
        nextEventItems: 5,
        cacheEventsItem: 10
      },
      toolbarButton: {
        name: 'horseracing',
        icon: 'Horse',
        route: 'products/racing'
      },
      widgets: [
        {
          name: '',
          routing: 'statistic',
          typeLink: WidgetTypeLink.MODAL,
          icon: 'baseline-assessment-24px' // without extension file
        }
      ],
      typeCoupon: {
        isMultipleStake: true,
        acceptMultiStake: true,
        typeLayout: LAYOUT_TYPE.RACING
      }
    },
    {
      sportId: 210,
      codeProduct: 'HORSE-VIRT',
      name: 'VirtualHorse',
      label: 'HORSE_VIRTUAL',
      order: 2,
      productSelected: false,
      isPlayable: true,
      layoutProducts: {
        type: LAYOUT_TYPE.RACING,
        resultItems: 4,
        nextEventItems: 5,
        cacheEventsItem: 10
      },
      toolbarButton: {
        name: 'virtualhorse',
        icon: 'Horse',
        route: 'products/racing'
      },
      widgets: [
        {
          name: '',
          routing: 'statistic',
          typeLink: WidgetTypeLink.MODAL,
          icon: 'baseline-assessment-24px' // without extension file
        }
      ],
      typeCoupon: {
        isMultipleStake: true,
        acceptMultiStake: true,
        typeLayout: LAYOUT_TYPE.RACING
      }
    },
    {
      sportId: 1,
      codeProduct: 'ITA-LEAGUE',
      name: 'Soccer',
      label: 'FOOTBALL_ITA',
      order: 4,
      productSelected: false,
      isPlayable: true,
      layoutProducts: {
        type: LAYOUT_TYPE.SOCCER,
        resultItems: 10,
        nextEventItems: 2,
        cacheEventsItem: 3
      },
      toolbarButton: {
        name: 'Italian League',
        icon: 'Soccer-ita',
        route: 'products/soccer'
      },
      widgets: [
        {
          name: '',
          routing: 'ranking',
          typeLink: WidgetTypeLink.MODAL,
          icon: 'ranking-cup' // without extension file
        },
        {
          name: '',
          routing: 'statistic',
          typeLink: WidgetTypeLink.MODAL,
          icon: 'baseline-assessment-24px' // without extension file
        }
      ],
      typeCoupon: {
        isMultipleStake: false,
        acceptMultiStake: false,
        typeLayout: LAYOUT_TYPE.SOCCER
      }
    },
    {
      sportId: 1,
      codeProduct: 'ENG-LEAGUE',
      name: 'Soccer',
      label: 'FOOTBALL_ENG',
      order: 5,
      productSelected: false,
      isPlayable: true,
      layoutProducts: {
        type: LAYOUT_TYPE.SOCCER,
        resultItems: 10,
        nextEventItems: 2,
        cacheEventsItem: 3
      },
      toolbarButton: {
        name: 'Italian League',
        icon: 'Soccer-eng',
        route: 'products/soccer'
      },
      widgets: [
        {
          name: '',
          routing: 'ranking',
          typeLink: WidgetTypeLink.MODAL,
          icon: 'ranking-cup' // without extension file
        },
        {
          name: '',
          routing: 'statistic',
          typeLink: WidgetTypeLink.MODAL,
          icon: 'baseline-assessment-24px' // without extension file
        }
      ],
      typeCoupon: {
        isMultipleStake: false,
        acceptMultiStake: false,
        typeLayout: LAYOUT_TYPE.SOCCER
      }
    },
    {
      sportId: 20,
      codeProduct: 'COCK',
      name: 'CockFight',
      label: 'COCK_FIGHT',
      order: 3,
      productSelected: false,
      isPlayable: true,
      layoutProducts: {
        // defines the layout type for last results widget
        type: LAYOUT_TYPE.COCK_FIGHT,
        resultItems: 4,
        nextEventItems: 5,
        shownMarkets: [
          Market['1X2'],
          Market['1X2OverUnder'],
          Market['1X2WinningSector'],
          Market['WinningSector'],
          Market['OverUnder']
        ],
        cacheEventsItem: 10
      },
      toolbarButton: {
        name: 'cockfight',
        icon: 'Cocks',
        route: 'products/cock-fight'
      },
      widgets: [
        {
          name: '',
          routing: 'statistic',
          typeLink: WidgetTypeLink.MODAL,
          icon: 'baseline-assessment-24px' // without extension file
        }
      ],
      typeCoupon: {
        isMultipleStake: true,
        acceptMultiStake: true,
        typeLayout: LAYOUT_TYPE.COCK_FIGHT
      }
    },
    {
      sportId: 18,
      codeProduct: 'KENO',
      name: 'Keno',
      label: 'KENO',
      order: 6,
      productSelected: false,
      isPlayable: true,
      layoutProducts: {
        // defines the layout type for different product group
        type: LAYOUT_TYPE.KENO,
        resultItems: 2, // items to show for last result
        nextEventItems: 2, // items to show for next events
        cacheEventsItem: 3
      },
      toolbarButton: {
        name: 'keno',
        icon: 'Keno',
        route: 'products/keno'
      },
      widgets: [
        {
          name: '',
          routing: 'hot-and-cold',
          typeLink: WidgetTypeLink.MODAL,
          icon: 'baseline-assessment-24px' // without extension file
        }
      ],
      typeCoupon: {
        isMultipleStake: false,
        acceptMultiStake: false,
        typeLayout: LAYOUT_TYPE.KENO
      }
    },
    {
      sportId: 24,
      codeProduct: 'CLRS',
      name: 'Colours',
      label: 'COLOURS',
      order: 7,
      productSelected: false,
      isPlayable: true,
      layoutProducts: {
        type: LAYOUT_TYPE.COLOURS,
        resultItems: 2,
        nextEventItems: 2,
        cacheEventsItem: 3
      },
      toolbarButton: {
        name: 'colours',
        icon: 'Colours',
        route: 'products/colours'
      },
      widgets: [
        {
          name: '',
          routing: 'hot-and-cold-colors',
          typeLink: WidgetTypeLink.MODAL,
          icon: 'baseline-assessment-24px' // without extension file
        }
      ],
      typeCoupon: {
        isMultipleStake: false,
        acceptMultiStake: false,
        typeLayout: LAYOUT_TYPE.COLOURS
      }
    },
    {
      sportId: 21,
      codeProduct: 'ARLT',
      name: 'Roulette',
      label: 'AMERICANROULETTE',
      order: 7,
      productSelected: false,
      isPlayable: true,
      layoutProducts: {
        type: LAYOUT_TYPE.AMERICANROULETTE,
        resultItems: 7,
        nextEventItems: 2,
        cacheEventsItem: 5
      },
      toolbarButton: {
        name: 'americanRoulette',
        icon: 'Roulette',
        route: 'products/americanRoulette'
      },
      widgets: [
        {
          name: '',
          routing: 'hot-and-cold-americanRoulette',
          typeLink: WidgetTypeLink.MODAL,
          icon: 'baseline-assessment-24px' // without extension file
        }
      ],
      typeCoupon: {
        isMultipleStake: true,
        acceptMultiStake: true,
        typeLayout: LAYOUT_TYPE.AMERICANROULETTE
      }
    }
  ],
  printSettings: {
    enabledPrintReceipt: {
      printLogoPayCancel: false,
      printHeaderMessage: true,
    },
    enabledPrintCoupon: {
      printLogoCoupon: true,
      printHeaderMessage: true,
      printQrCode: false,
      isEnabledReprintCoupon: true,
      isTrasmitionInfoMessageShown: false,
      hideMaxPaymentAmount: false,
    }
  }
};
