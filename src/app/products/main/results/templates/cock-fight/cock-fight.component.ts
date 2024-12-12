import { Component, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Rx';
import { LAYOUT_TYPE } from '../../../../../../environments/environment.models';
import { WindowSize } from '../../../../products.model';
import { EventsResultsWithDetails, LastResult } from '../../results.model';
import { ResultsService } from '../../results.service';

@UntilDestroy()
@Component({
  selector: 'app-results-cock-fight',
  templateUrl: './cock-fight.component.html',
  styleUrls: ['./cock-fight.component.scss']
})
export class CockFightComponent {
  @Input() items: number;
  @Input() rowHeight: number;
  @Input() codeProduct: string;
  @Input() windowSize: WindowSize;
  public results$: Observable<EventsResultsWithDetails[]>;
  constructor(public resultsService: ResultsService) {
    this.results$ = this.resultsService.lastResultsSubject.pipe(
      untilDestroyed(this),
      filter(el => el.layoutType && el.layoutType === LAYOUT_TYPE.COCK_FIGHT),
      map((res: LastResult) => res.eventResults)
    );
  }
}
