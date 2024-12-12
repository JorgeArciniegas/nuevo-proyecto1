import { TestBed } from "@angular/core/testing";
import { Subject } from "rxjs";
import { cloneData } from "src/app/mock/helpers/clone-mock.helper";
import { mockEventDetails, mockEventList } from "src/app/mock/sports.mock";
import { EventDetail } from "../main.models";
import { MainService } from "../main.service";
import { EventsList } from "./event-list.model";
import { EventsListService } from "./events-list.service";

class MainServiceStub {
  currentEventSubscribe: Subject<number>;
  eventDetails: EventDetail;

  constructor() {
    this.currentEventSubscribe = new Subject<number>();
    this.eventDetails = cloneData(mockEventDetails);
  }
}

describe('EventsListService', () => {
  let service: EventsListService;
  let mainService: MainService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventsListService,
        { provide: MainService, useClass: MainServiceStub }
      ],
    });

    service = TestBed.inject(EventsListService);
    mainService = TestBed.inject(MainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get events details list', () => {
    service.eventsDetails = null;
    const expected: EventsList = cloneData(mockEventList);

    service.getEventDetailsList();

    expect(service.eventsDetails).toEqual(expected);
  });

  it('should build the number of columns needed to show on the NativeScript template "event-list"', () => {
    const expected: string = '*,*,*,*,*';

    const result = service.genColumns(5);
    expect(result).toEqual(expected);
  });
});
