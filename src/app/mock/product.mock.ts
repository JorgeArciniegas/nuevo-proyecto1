import { Products } from "src/environments/environment.models";

export const mockProduct: Products = {
  codeProduct: "DOG",
  isPlayable: true,
  label: "DOG",
  layoutProducts: {type: 0, resultItems: 4, nextEventItems: 5, cacheEventsItem: 10, multiFeedType: 'F2'},
  name: "DogRacing",
  order: 0,
  productSelected: true,
  sportId: 8,
  toolbarButton: {name: 'dogracing', icon: 'Dog', route: 'products/racing'},
  typeCoupon: {isMultipleStake: true, acceptMultiStake: true, typeLayout: 0},
  widgets: [
    {name: '', routing: 'statistic', typeLink: 0, icon: 'baseline-assessment-24px'}
  ]
}

export const mockProductSoccer: Products = {
  codeProduct: 'ITA-LEAGUE',
  isPlayable: true,
  label: 'FOOTBALL_ITA',
  layoutProducts: {type: 2, resultItems: 10, nextEventItems: 1, cacheEventsItem: 3, multiFeedType: 'F6'},
  name: 'Soccer',
  order: 4,
  productSelected: true,
  sportId: 1,
  toolbarButton: {name: 'Italian League', icon: 'Soccer-ita', route: 'products/soccer'},
  typeCoupon: {isMultipleStake: false, acceptMultiStake: false, typeLayout: 2},
  widgets: [
    {
      icon: 'ranking-cup',
      name: '',
      routing: 'ranking',
      typeLink: 0
    },
    {
      name: '',
      routing: 'statistic',
      typeLink: 0,
      icon: 'baseline-assessment-24px'
    }
  ]
}
