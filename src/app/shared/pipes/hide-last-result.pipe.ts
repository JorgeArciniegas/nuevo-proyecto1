import { Pipe, PipeTransform } from '@angular/core';
import { LAYOUT_TYPE } from '../../../environments/environment.models';
import { defaultEventDurationByLayoutType, EventsResultsWithDetails } from '../../products/main/results/results.model';
import { ResultsService } from '../../products/main/results/results.service';

@Pipe({
  name: 'hideLastResult'
})
/**
 * Show/Hide last results based countDownInSeconds
 * If countdown is greater than remainingTime, means that current event is not finished yet and its results must be hidden
 */
export class HideLastResultPipe implements PipeTransform {

  constructor(private resultsService: ResultsService) { }
  transform(eventResultsWithDetails: EventsResultsWithDetails[], countDownInSeconds: number): EventsResultsWithDetails[] {
    if (eventResultsWithDetails?.length > 0) {
        const isDelayActive: boolean = this.isDelayActive(countDownInSeconds, this.resultsService.layoutType, eventResultsWithDetails[0].eventNumber);
        eventResultsWithDetails[0].show = isDelayActive ? false : true;
        eventResultsWithDetails[eventResultsWithDetails.length - 1].show = !eventResultsWithDetails[0].show;
        return eventResultsWithDetails.filter((v) => v.show);
    }
    return null;
  }

  /**
  * Used for manage rematingTime countdown.
  * Calculate remaining time between the nextEvent duration and current event duration
  * @param countDown
  * @param layoutType
  * @returns true if currentEvent is not over or if currentEvent is over and new results are available before cd expiration and it's not a duplicated event
  */
  isDelayActive(countDown: number, layoutType: LAYOUT_TYPE, eventNumber: number): boolean {
    const defaultEventDuration: number = defaultEventDurationByLayoutType[layoutType].videoLengthDuration; //security fallback
    const eventDuration: number = this.resultsService.resultsUtils.currentEventVideoDuration;
    let currentEventDuration: number = (eventDuration && eventDuration > 0) ? eventDuration : defaultEventDuration;
     const timeToShowResult: number = this.resultsService.resultsUtils.nextEventDuration - currentEventDuration;
    let isNewResultBeforeCountDownExpiration: boolean = this.resultsService.resultsUtils.nextEventNumber === eventNumber;
    return (countDown >= timeToShowResult || ((countDown < timeToShowResult) && (isNewResultBeforeCountDownExpiration && !this.resultsService.resultsUtils.isDuplicatedEvent)))
  }

}
