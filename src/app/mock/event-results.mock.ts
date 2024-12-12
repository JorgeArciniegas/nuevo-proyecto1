import { EventResult } from "@elys/elys-api";
import { Band } from "../products/main/playable-board/templates/colours/colours.models";
import { EventsResultsWithDetails, OVER_UNDER_COCKFIGHT } from "../products/main/results/results.model";

export const mockEventResults: EventResult[] = [
  {
    EventId: 21243157,
    EventName: "Race n. 603",
    Result: "1-2-6",
    TournamentId: 21236857,
    TournamentName: "Tournament HorseRacing"
  },
  {
    EventId: 21243069,
    EventName: "Race n. 600",
    Result: "5-2-6",
    TournamentId: 21236857,
    TournamentName: "Tournament HorseRacing"
  }
];

export const eventsResultsWithDetailsRace: EventsResultsWithDetails[] = [
  {
    eventLabel: "Race n. 603",
    eventNumber: 21243157,
    racePodium: {firstPlace: 1, secondPlace: 2, thirdPlace: 6},
    show: false
  },
  {
    eventLabel: "Race n. 600",
    eventNumber: 21243069,
    racePodium: {firstPlace: 5, secondPlace: 2, thirdPlace: 6},
    show: true
  }
];

export const eventsResultsWithDetailsCock: EventsResultsWithDetails[] = [
  {
    cockResult: {winner: 1, ou: '2', sector: 6} as any,
    eventLabel: "Race n. 603",
    eventNumber: 21243157,
    show: false
  },
  {
    cockResult: {winner: 5, ou: '2', sector: 6} as any,
    eventLabel: "Race n. 600",
    eventNumber: 21243069,
    show: true
  }
];

export const eventsResultsWithDetailsKeno: EventsResultsWithDetails[] = [
  {
    eventLabel: "Race n. 603",
    eventNumber: 21243157,
    kenoResults: [1],
    show: false
  },
  {
    eventLabel: "Race n. 600",
    eventNumber: 21243069,
    kenoResults: [5],
    show: true
  }
];

export const eventsResultsWithDetailsColours: EventsResultsWithDetails[] = [
  {
    coloursResults: {
      numbersExtracted: [
        {number: 1, colour: 1}
      ],
      hiloWinningSelection: Band.HI,
      hiloNumber: 1
    },
    eventLabel: "Race n. 603",
    eventNumber: 21243157,
    show: false
  },
  {
    coloursResults: {
      numbersExtracted: [
        {number: 5, colour: 2},
      ],
      hiloWinningSelection: Band.HI,
      hiloNumber: 5
    },
    eventLabel: "Race n. 600",
    eventNumber: 21243069,
    show: true
  }
];

export const eventsResultsWithDetailsRoulette: EventsResultsWithDetails[] = [
  {
    americanRouletteResults: {result: '1-2-6'},
    eventLabel: "Race n. 603",
    eventNumber: 21243157,
    show: false
  },
  {
    americanRouletteResults: {result: '5-2-6'},
    eventLabel: "Race n. 600",
    eventNumber: 21243069,
    show: true
  }
];

export const mockEventResultsSoccer: EventResult[] = [
  {
    EventId: 21255044,
    EventName: "ROM - INT",
    Result: "3-1",
    TournamentId: 21255034,
    TournamentName: "Week #17"
  },
  {
    EventId: 21255043,
    EventName: "SAM - NAP",
    Result: "0-2",
    TournamentId: 21255034,
    TournamentName: "Week #17"
  },
  {
    EventId: 21254932,
    EventName: "VER - SAS",
    Result: "3-2",
    TournamentId: 21254930,
    TournamentName: "Week #16"
  },
  {
    EventId: 21254931,
    EventName: "MIL - ROM",
    Result: "2-0",
    TournamentId: 21254930,
    TournamentName: "Week #16"
  }
];

export const eventsResultsWithDetailsSoccer: EventsResultsWithDetails[] = [
  {
    eventLabel: "Week #17",
    eventNumber: 21255034,
    show: false,
    soccerResult: [
      {
        EventId: 21255044,
        EventName: "ROM - INT",
        Result: "3-1",
        TournamentId: 21255034,
        TournamentName: "Week #17"
      },
      {
        EventId: 21255043,
        EventName: "SAM - NAP",
        Result: "0-2",
        TournamentId: 21255034,
        TournamentName: "Week #17"
      }
    ]
  },
  {
    eventLabel: "Week #16",
    eventNumber: 21254930,
    show: true,
    soccerResult: [
      {
        EventId: 21254932,
        EventName: "VER - SAS",
        Result: "3-2",
        TournamentId: 21254930,
        TournamentName: "Week #16"
      },
      {
        EventId: 21254931,
        EventName: "MIL - ROM",
        Result: "2-0",
        TournamentId: 21254930,
        TournamentName: "Week #16"
      }
    ]
  }
];

