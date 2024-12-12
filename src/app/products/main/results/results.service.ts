import { Injectable } from '@angular/core';
import { ElysApiService, EventResult, VirtualSportLastResultsRequest, VirtualSportLastResultsResponse } from '@elys/elys-api';
import { IVideoInfo } from '@elys/elys-api/lib/virtual-v2/interfaces/video-info.interface';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { LAYOUT_TYPE } from '../../../../../src/environments/environment.models';
import { ProductsService } from '../../products.service';
import { Band, Colour } from '../playable-board/templates/colours/colours.models';
import { Results } from './results';
import { ColoursNumber, ColoursResult, defaultEventDurationByLayoutType, EventsResultsWithDetails, LastResult, OVER_UNDER_COCKFIGHT, videoInfoDelay } from './results.model';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  /**
   * Number of item to show as last result defined in environment
   */
  public get resultItemsLength(): number {
    return this.productService.product.layoutProducts.resultItems;
  }

  public get layoutType(): LAYOUT_TYPE {
    return this.productService.product.layoutProducts.type;
  }
  public resultsUtils: Results;
  eventsResultsDuringDelay: EventsResultsWithDetails[] = null;
  typeLayout: typeof LAYOUT_TYPE = LAYOUT_TYPE;
  private _timerSubscription: Subscription;
  constructor(
    private productService: ProductsService,
    private elysApi: ElysApiService,
  ) {
    this.resultsUtils = new Results();
  }

  private _lastResults: LastResult = { eventResults: [], layoutType: undefined };
  public lastResultsSubject: BehaviorSubject<LastResult> = new BehaviorSubject<LastResult>(this._lastResults);
  async getLastResult() {
    // Reset previous/pending timer subsc. to avoid unuseful api call to video info (when changing sport before timer expiration)
    if (this._timerSubscription) this._timerSubscription.unsubscribe();
    const request: VirtualSportLastResultsRequest = {
      SportId: this.productService.product.sportId,
      CategoryType: this.productService.product.codeProduct,
      MultiFeedType: this.productService.product.layoutProducts.multiFeedType
    };

    let tmpListResult: EventsResultsWithDetails[] = [];
    const eventResults: VirtualSportLastResultsResponse = await this.elysApi.virtual.getLastResult(request);
    this.resultsUtils.currentEventVideoDuration = 0;
    switch (this.layoutType) {
      case LAYOUT_TYPE.COLOURS:
      case LAYOUT_TYPE.KENO:
        // Color and Keno doesn't need to call video info.
        // Default client delay is used instead
        tmpListResult = this.setResultByLayoutType(eventResults.EventResults.slice(0, this.resultItemsLength + 1), ',');
        break;
      case LAYOUT_TYPE.SOCCER:
        this.setVideoInfoTiming(eventResults);
        tmpListResult = this.populateSoccerResult(eventResults);
        break;
      default:
        this.setVideoInfoTiming(eventResults);
        tmpListResult = this.setResultByLayoutType(eventResults.EventResults.slice(0, this.resultItemsLength + 1), '-');
    }

    this._lastResults.layoutType = this.layoutType;
    this._lastResults.eventResults = tmpListResult;
    this.lastResultsSubject.next(this._lastResults);
  }

  /**
   *  Debounce few seconds video info api call.
   *  Waits for the server generates results, hopefully in the defined delay
   * @param eventResults 
   */
  setVideoInfoTiming(eventResults: VirtualSportLastResultsResponse): void {
    this._timerSubscription = timer(videoInfoDelay).subscribe(() => {
      const id: number = this.layoutType === LAYOUT_TYPE.SOCCER
        ? eventResults.EventResults[0].TournamentId
        : eventResults.EventResults[0].EventId
      this.getVideoInfo(id, this.layoutType);
    })
  }

  populateSoccerResult(eventResults: VirtualSportLastResultsResponse): EventsResultsWithDetails[] {
    let tmpListResult: EventsResultsWithDetails[] = [];
    if (eventResults.EventResults !== null) {
      // create last Result 
      const tempEventResult: EventsResultsWithDetails = {
        eventLabel: eventResults.EventResults[0].TournamentName,
        eventNumber: eventResults.EventResults[0].TournamentId,
        show: false,
         // group by last Tournament
        soccerResult: eventResults.EventResults.filter(item => item.TournamentId === eventResults.EventResults[0].TournamentId)
      };
      tmpListResult.push(tempEventResult);
      // Create last but one result
      let exceededSoccerResults: EventsResultsWithDetails = null;
      exceededSoccerResults = {
        eventLabel: eventResults.EventResults[this.resultItemsLength].TournamentName,
        eventNumber: eventResults.EventResults[this.resultItemsLength].TournamentId,
        show: true,
        // Group by last but one result
        soccerResult: eventResults.EventResults.filter(item => item.TournamentId === eventResults.EventResults[this.resultItemsLength].TournamentId)
      };
      tmpListResult.push(exceededSoccerResults);
    }
    return tmpListResult;
  }

  /**
   * 
   * @param eventResults results from api
   * @param splitChar char where to split results. Depends on product (Racing and Cock split on '-', Keno and Colours split on ',').
   * @returns 
   */
  setResultByLayoutType(eventResults: EventResult[], splitChar: string): EventsResultsWithDetails[] {
    let eventsResultsWithDetails: EventsResultsWithDetails[] = []
    eventResults.forEach((event, index) => {
      let eventResultWithDetails: EventsResultsWithDetails = {
        eventLabel: event.EventName,
        eventNumber: event.EventId,
        show: (index === 0) ? false : true
      };
      let results: string[] = event.Result.split(splitChar);
      switch (this.layoutType) {
        case LAYOUT_TYPE.RACING:
          eventResultWithDetails = {
            ...eventResultWithDetails,
            racePodium: {
              firstPlace: Number.parseInt(results[0], 0),
              secondPlace: Number.parseInt(results[1], 0),
              thirdPlace: Number.parseInt(results[2], 0)
            }
          }
          break;
        case LAYOUT_TYPE.COCK_FIGHT:
          eventResultWithDetails = {
            ...eventResultWithDetails,
            cockResult: {
              winner: Number.parseInt(results[0], 0),
              ou: results[1] as OVER_UNDER_COCKFIGHT,
              sector: Number.parseInt(results[2], 0),
            }
          }
          break;
        case LAYOUT_TYPE.KENO:
          eventResultWithDetails = {
            ...eventResultWithDetails,
            kenoResults: results.map(result => Number.parseInt(result, 0))
          }
          break;
        case LAYOUT_TYPE.COLOURS:
          const coloursNumbers: ColoursNumber[] = [];
          const numbersExtracted: number[] = results.map(result => Number.parseInt(result, 0));
          for (const numberExtracted of numbersExtracted) {
            const coloursNumber: ColoursNumber = {
              number: numberExtracted,
              colour: this.checkNumberColour(numberExtracted)
            };
            coloursNumbers.push(coloursNumber);
          }
          const hiloNumber: number = numbersExtracted.reduce((a, b) => a + b, 0);
          let hiloWinningSelection: Band;
          if (hiloNumber >= 21 && hiloNumber <= 148) {
            hiloWinningSelection = Band.LO;
          } else if (hiloNumber >= 149 && hiloNumber <= 151) {
            hiloWinningSelection = Band.MID;
          } else {
            hiloWinningSelection = Band.HI;
          }
          const coloursResult: ColoursResult = {
            numbersExtracted: coloursNumbers,
            hiloWinningSelection: hiloWinningSelection,
            hiloNumber: hiloNumber
          };
          eventResultWithDetails.coloursResults = coloursResult;
          break;
        case LAYOUT_TYPE.AMERICANROULETTE:
          eventResultWithDetails = {
            ...eventResultWithDetails,
            americanRouletteResults: {
              result: event.Result,
            }
          }
          break;
        default:
          break;
      }
      eventsResultsWithDetails.push(eventResultWithDetails);
    })
    return eventsResultsWithDetails;
  }

  private getVideoInfo(eventId: number, layoutType: LAYOUT_TYPE): void {
    this.elysApi.virtualV2.getVideoInfo(
      this.productService.product.sportId,
      this.productService.product.codeProduct,
      eventId
    ).pipe(take(1))
      .subscribe(
        (videoMetadataVirtualVideoInfoResponse: IVideoInfo) => {
          // Sets the video duration
          this.resultsUtils.currentEventVideoDuration = this.checkVideoInfo(videoMetadataVirtualVideoInfoResponse)
            ? (videoMetadataVirtualVideoInfoResponse.VideoInfo.Video.Duration
              // Substract the delay used for the video info api call
              - (videoInfoDelay / 1000))
            // Add static video extra length
            + defaultEventDurationByLayoutType[layoutType].videoExtraDuration
            : 0;
        }
      );
  }

  /**
   * checkVideoInfo check if video info response is empty due its server generation time
   * @param videoMetadataVirtualVideoInfoResponse video info response
   * 
   */
  private checkVideoInfo(videoMetadataVirtualVideoInfoResponse: IVideoInfo): boolean {
    if (
      !videoMetadataVirtualVideoInfoResponse ||
      !videoMetadataVirtualVideoInfoResponse.VideoInfo ||
      !videoMetadataVirtualVideoInfoResponse.VideoUrls ||
      videoMetadataVirtualVideoInfoResponse.VideoUrls.length === 0 ||
      videoMetadataVirtualVideoInfoResponse.VideoInfo.Video.Duration <= 0
    ) return false;
    return true;
  }

  private checkNumberColour(colourNumber: number): Colour {
    if (colourNumber === 49) {
      return Colour.YELLOW;
    }
    if (colourNumber % 3 === 1) {
      return Colour.RED;
    }
    if (colourNumber % 3 === 2) {
      return Colour.BLUE;
    }
    if (colourNumber % 3 === 0) {
      return Colour.GREEN;
    }
  }
}
