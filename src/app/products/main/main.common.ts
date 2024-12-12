import { Routes } from '@angular/router';
import { EventControlComponent } from './event-control/event-control.component';
import { EventListComponent } from './events-list/events-list.component';
import { StandardComponent as EventsListStandardComponent } from './events-list/templates/standard/standard.component';
import { LuckyComponent } from './lucky/lucky.component';
import { AmericanrouletteComponent as LuckyAmericanrouletteComponent } from './lucky/templates/americanroulette/americanroulette.component';
import { CockFightComponent as LuckyCockFightComponent } from './lucky/templates/cock-fight/cock-fight.component';
import { ColoursComponent as LuckyColoursComponent } from './lucky/templates/colours/colours.component';
import { Bet0Component as LuckyBet0Component } from './lucky/templates/colours/games/bet0/bet0.component';
import { Bet49Component as LuckyBet49Component } from './lucky/templates/colours/games/bet49/bet49.component';
import { DragonComponent as LuckyDragonComponent } from './lucky/templates/colours/games/dragon/dragon.component';
import { HiloComponent as LuckyHiloComponent } from './lucky/templates/colours/games/hilo/hilo.component';
import { RainbowComponent as LuckyRainbowComponent } from './lucky/templates/colours/games/rainbow/rainbow.component';
import { TotalColourComponent as LuckyTotalColourComponent } from './lucky/templates/colours/games/total-colour/total-colour.component';
import { KenoComponent as LuckyKenoComponent } from './lucky/templates/keno/keno.component';
import { RaceComponent as LuckyRaceComponent } from './lucky/templates/race/race.component';
import { SoccerComponent as LuckySoccerComponent } from './lucky/templates/soccer/soccer.component';
import { MainComponent } from './main.component';
import { CompetitorItoPipe } from './playable-board/competitor-ito.pipe';
import { CompetitorNamePipe } from './playable-board/competitor-name.pipe';
import { ExtractCorrectScorePipe } from './playable-board/extract-correct-score.pipe';
import { ExtractSignPipe } from './playable-board/extract-sign.pipe';
import { FilterAndSortByShownMarketsPipe } from './playable-board/filter-and-sort-by-shown-markets.pipe';
import { FilterByPositionPipe } from './playable-board/filter-by-position.pipe';
import { FilterMarketsByAreaColumnPipe } from './playable-board/filter-markets-by-area-column.pipe';
import { PlayableBoardComponent } from './playable-board/playable-board.component';
import { AmericanRouletteComponent as PlayableBoardAmericanRouletteComponent } from './playable-board/templates/american-roulette/american-roulette.component';
import { SelectColumnPipe } from './playable-board/templates/american-roulette/select-column.pipe';
import { CockFightComponent as PlayableBoardCockFightComponent } from './playable-board/templates/cock-fight/cock-fight.component';
import { ColoursComponent as PlayableBoardColoursComponent } from './playable-board/templates/colours/colours.component';
import { Bet0Component as PlayableBoardBet0Component } from './playable-board/templates/colours/games/bet0/bet0.component';
import { Bet49Component as PlayableBoardBet49Component } from './playable-board/templates/colours/games/bet49/bet49.component';
import { DragonComponent as PlayableBoardDragonComponent } from './playable-board/templates/colours/games/dragon/dragon.component';
import { HiLoComponent } from './playable-board/templates/colours/games/hilo/hilo.component';
import { NumbersBoardComponent } from './playable-board/templates/colours/games/numbers-board/numbers-board.component';
import { RainbowComponent as PlayableBoardRainbowComponent } from './playable-board/templates/colours/games/rainbow/rainbow.component';
import { TotalColourComponent as PlayableBoardTotalColourComponent } from './playable-board/templates/colours/games/total-colour/total-colour.component';
import { GetArrayFromNumberPipe } from './playable-board/templates/get-array-from-number.pipe';
import { KenoComponent as PlayableBoardKenoComponentComponent } from './playable-board/templates/keno/keno.component';
import { RaceComponent as PlayableBoardRaceComponent } from './playable-board/templates/race/race.component';
import { DetailComponent as PlayableBoardSoccerDetailComponent } from './playable-board/templates/soccer/detail/detail.component';
import { OverviewComponent as PlayableBoardSoccerOverviewComponent } from './playable-board/templates/soccer/overview/overview.component';
import { SoccerComponent as PlayableBoardSoccerComponent } from './playable-board/templates/soccer/soccer.component';
import { ResultsComponent } from './results/results.component';
import { AmericanrouletteComponent as ResultAmericanRouletteComponent } from './results/templates/americanroulette/americanroulette.component';
import { CockFightComponent as ResultsCockFightComponent } from './results/templates/cock-fight/cock-fight.component';
import { ColoursComponent as ResultsColoursComponent } from './results/templates/colours/colours.component';
import { KenoComponent as ResultsKenoComponent } from './results/templates/keno/keno.component';
import { RaceComponent as ResultsRaceComponent } from './results/templates/race/race.component';
import { SoccerComponent as ResultsSoccerComponent } from './results/templates/soccer/soccer.component';

export const componentDeclarations: any[] = [

  MainComponent,
  EventControlComponent,
  EventListComponent,
  LuckyComponent,
  LuckyCockFightComponent,
  LuckyRaceComponent,
  ResultsComponent,
  PlayableBoardComponent,
  FilterByPositionPipe,
  FilterAndSortByShownMarketsPipe,
  GetArrayFromNumberPipe,
  FilterMarketsByAreaColumnPipe,
  CompetitorNamePipe,
  CompetitorItoPipe,
  ExtractSignPipe,
  ResultsRaceComponent,
  PlayableBoardRaceComponent,
  EventsListStandardComponent,
  ResultsCockFightComponent,
  PlayableBoardCockFightComponent,
  PlayableBoardSoccerComponent,
  PlayableBoardSoccerOverviewComponent,
  PlayableBoardSoccerDetailComponent,
  ResultsSoccerComponent,
  LuckySoccerComponent,
  ExtractCorrectScorePipe,
  PlayableBoardKenoComponentComponent,
  ResultsKenoComponent,
  LuckyKenoComponent,
  PlayableBoardAmericanRouletteComponent,
  PlayableBoardColoursComponent,
  PlayableBoardBet49Component,
  PlayableBoardBet0Component,
  PlayableBoardDragonComponent,
  PlayableBoardRainbowComponent,
  HiLoComponent,
  ResultsColoursComponent,
  LuckyColoursComponent,
  LuckyBet49Component,
  LuckyBet0Component,
  LuckyHiloComponent,
  LuckyDragonComponent,
  LuckyRainbowComponent,
  NumbersBoardComponent,
  PlayableBoardTotalColourComponent,
  LuckyTotalColourComponent,
  SelectColumnPipe,
  LuckyAmericanrouletteComponent,
  ResultAmericanRouletteComponent
];

export const routes: Routes = [
  {
    path: '',
    component: MainComponent
  }
];
