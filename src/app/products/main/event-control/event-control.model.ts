export class EventControl {
  productImageClass: string;
  productName: string;
  currentEvent: CurrentEvent;
  eventLabel: string;
  eventNumber: number;
  eventTimeMinutes?: number;
  eventTimeSeconds?: number;
  showEventId: boolean;
  isWindowSizeSmall?: boolean; // used by native script
  theme?: string; // used by native script
}

export interface CurrentEvent {
  number: number;
  label: string;
  date: Date;
}
