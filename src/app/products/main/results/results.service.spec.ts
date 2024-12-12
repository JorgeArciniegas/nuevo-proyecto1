import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { ElysApiService, EventResult, VirtualSportLastResultsResponse } from "@elys/elys-api";
import * as mockService from "src/app/mock/event-results.mock";
import { ElysApiServiceStub } from "src/app/mock/stubs/elys-api.stub";
import { LAYOUT_TYPE } from "src/environments/environment.models";
import { ProductsService } from "../../products.service";
import { EventsResultsWithDetails, LastResult, videoInfoDelay } from "./results.model";
import { ResultsService } from "./results.service";

const productsService = {
  product: {
    layoutProducts: {
      type: LAYOUT_TYPE.SOCCER,
      resultItems: 0
    }
  }
}

describe('ResultsService', () => {
  let service: ResultsService;
  let elysApi: ElysApiServiceStub;

  beforeEach(() => {
    elysApi = new ElysApiServiceStub();

    TestBed.configureTestingModule({
      providers: [
        ResultsService,
        { provide: ProductsService, useValue: productsService },
        { provide: ElysApiService, useValue: elysApi }
      ],
    });

    service = TestBed.inject(ResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return layout type', () => {
    const layoutType: LAYOUT_TYPE = LAYOUT_TYPE.SOCCER;

    productsService.product.layoutProducts.type = layoutType;
    expect(service.layoutType).toEqual(layoutType);
  });

  it('should return result items length', () => {
    const resultItemsLength: number = 4;

    productsService.product.layoutProducts.resultItems = resultItemsLength;
    expect(service.resultItemsLength).toEqual(resultItemsLength);
  });

  it('should set result by layout type for Racing', () => {
    const eventResults: EventResult[] = mockService.mockEventResults;
    const splitChar: string = '-';
    const expected: EventsResultsWithDetails[] = mockService.eventsResultsWithDetailsRace;
    spyOnProperty(service, 'layoutType').and.returnValue(LAYOUT_TYPE.RACING);

    const result: EventsResultsWithDetails[] = service.setResultByLayoutType(eventResults, splitChar);
    expect(result).toEqual(expected);
  });

  it('should set result by layout type for Cock', () => {
    const eventResults: EventResult[] = mockService.mockEventResults;
    const splitChar: string = '-';
    const expected: EventsResultsWithDetails[] = mockService.eventsResultsWithDetailsCock;
    spyOnProperty(service, 'layoutType').and.returnValue(LAYOUT_TYPE.COCK_FIGHT);

    const result: EventsResultsWithDetails[] = service.setResultByLayoutType(eventResults, splitChar);
    expect(result).toEqual(expected);
  });

  it('should set result by layout type for Keno', () => {
    const eventResults: EventResult[] = mockService.mockEventResults;
    const splitChar: string = ',';
    const expected: EventsResultsWithDetails[] = mockService.eventsResultsWithDetailsKeno;
    spyOnProperty(service, 'layoutType').and.returnValue(LAYOUT_TYPE.KENO);

    const result: EventsResultsWithDetails[] = service.setResultByLayoutType(eventResults, splitChar);
    expect(result).toEqual(expected);
  });

  it('should set result by layout type for Colours', () => {
    const eventResults: EventResult[] = mockService.mockEventResults;
    const splitChar: string = ',';
    const expected: EventsResultsWithDetails[] = mockService.eventsResultsWithDetailsColours;
    spyOnProperty(service, 'layoutType').and.returnValue(LAYOUT_TYPE.COLOURS);

    const result: EventsResultsWithDetails[] = service.setResultByLayoutType(eventResults, splitChar);
    expect(result).toEqual(expected);
  });

  it('should set result by layout type for American Roulette', () => {
    const eventResults: EventResult[] = mockService.mockEventResults;
    const splitChar: string = '-';
    const expected: EventsResultsWithDetails[] = mockService.eventsResultsWithDetailsRoulette;
    spyOnProperty(service, 'layoutType').and.returnValue(LAYOUT_TYPE.AMERICANROULETTE);

    const result: EventsResultsWithDetails[] = service.setResultByLayoutType(eventResults, splitChar);
    expect(result).toEqual(expected);
  });

  it('should populate soccer result', () => {
    const eventResults: VirtualSportLastResultsResponse = {
      EventResults: mockService.mockEventResultsSoccer
    };

    spyOnProperty(service, 'resultItemsLength').and.returnValue(mockService.mockEventResultsSoccer.length/2);

    const expected = service.populateSoccerResult(eventResults);
    expect(expected).toEqual(mockService.eventsResultsWithDetailsSoccer);
  });

  it('should get last results for Keno', async() => {
    const layoutType: LAYOUT_TYPE = LAYOUT_TYPE.KENO;
    const eventResults: VirtualSportLastResultsResponse = {
      EventResults: mockService.mockEventResults
    };

    const expectedLastResult: LastResult = {
      layoutType: layoutType,
      eventResults: mockService.eventsResultsWithDetailsKeno
    };

    spyOn(elysApi.virtual, 'getLastResult').and.returnValue(Promise.resolve(eventResults));
    spyOn(service, 'setResultByLayoutType').and.returnValue(mockService.eventsResultsWithDetailsKeno);

    spyOnProperty(service, 'layoutType').and.returnValue(layoutType);
    spyOnProperty(service, 'resultItemsLength').and.returnValue(mockService.mockEventResults.length);

    await service.getLastResult();

    expect(service.setResultByLayoutType).toHaveBeenCalledWith(eventResults.EventResults, ',')
    expect(service.lastResultsSubject.value).toEqual(expectedLastResult);
  });

  it('should get last results for Soccer', async() => {
    const layoutType: LAYOUT_TYPE = LAYOUT_TYPE.SOCCER;
    const eventResults: VirtualSportLastResultsResponse = {
      EventResults: mockService.mockEventResultsSoccer
    };

    const expectedLastResult: LastResult = {
      layoutType: layoutType,
      eventResults: mockService.eventsResultsWithDetailsSoccer
    };

    spyOn(service, 'setVideoInfoTiming');
    spyOn(elysApi.virtual, 'getLastResult').and.returnValue(Promise.resolve(eventResults));
    spyOn(service, 'populateSoccerResult').and.returnValue(mockService.eventsResultsWithDetailsSoccer);

    spyOnProperty(service, 'layoutType').and.returnValue(layoutType);
    spyOnProperty(service, 'resultItemsLength').and.returnValue(mockService.mockEventResults.length/2);

    await service.getLastResult();

    expect(service.populateSoccerResult).toHaveBeenCalledWith(eventResults)
    expect(service.lastResultsSubject.value).toEqual(expectedLastResult);
  });

  it('should get last results for Cock', async() => {
    const layoutType: LAYOUT_TYPE = LAYOUT_TYPE.COCK_FIGHT;
    const eventResults: VirtualSportLastResultsResponse = {
      EventResults: mockService.mockEventResults
    };

    const expectedLastResult: LastResult = {
      layoutType: layoutType,
      eventResults: mockService.eventsResultsWithDetailsCock
    };

    spyOn(service, 'setVideoInfoTiming');
    spyOn(elysApi.virtual, 'getLastResult').and.returnValue(Promise.resolve(eventResults));
    spyOn(service, 'setResultByLayoutType').and.returnValue(mockService.eventsResultsWithDetailsCock);

    spyOnProperty(service, 'layoutType').and.returnValue(layoutType);
    spyOnProperty(service, 'resultItemsLength').and.returnValue(mockService.mockEventResults.length);

    await service.getLastResult();

    expect(service.setResultByLayoutType).toHaveBeenCalledWith(eventResults.EventResults, '-')
    expect(service.lastResultsSubject.value).toEqual(expectedLastResult);
  });

  it('should set video info timing', fakeAsync(() => {
    spyOnProperty(service, 'layoutType', 'get').and.returnValue(LAYOUT_TYPE.RACING);

    const spyGetVideoInfo = spyOn<any>(service, 'getVideoInfo');
    const eventResults: VirtualSportLastResultsResponse = {
      EventResults: [{
        EventId: 20995881,
        EventName: 'Race n. 504',
        TournamentId: 20990631,
        TournamentName: 'Tournament DogRacing',
        Result: '3-4-5'
      }]
    };

    service.setVideoInfoTiming(eventResults);
    tick(videoInfoDelay);

    expect(spyGetVideoInfo).toHaveBeenCalledTimes(1);
  }));

});
