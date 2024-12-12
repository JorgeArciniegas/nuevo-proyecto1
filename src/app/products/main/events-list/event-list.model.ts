export class EventsList {
  events: EventList[];
  currentEvent: number;
}
export interface EventList {
  eventLabel: string;
  eventStart: Date;
  eventNumber: number;
}
