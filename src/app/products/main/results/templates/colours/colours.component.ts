import { Component, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Rx';
import { LAYOUT_TYPE } from '../../../../../../environments/environment.models';
import { Colour } from '../../../playable-board/templates/colours/colours.models';
import { EventsResultsWithDetails, LastResult } from '../../results.model';
import { ResultsService } from '../../results.service';

@UntilDestroy()
@Component({
  selector: 'app-results-colours',
  templateUrl: './colours.component.html',
  styleUrls: ['./colours.component.scss']
})
export class ColoursComponent {
  @Input() rowHeight: number;
  public Colour = Colour;
  public results$: Observable<EventsResultsWithDetails[]>;
  constructor(public resultsService: ResultsService) {
    this.results$ = this.resultsService.lastResultsSubject.pipe(
      untilDestroyed(this),
      filter(el => el.layoutType && el.layoutType === LAYOUT_TYPE.COLOURS),
      map((res: LastResult) => res.eventResults)
    );
  }

}
