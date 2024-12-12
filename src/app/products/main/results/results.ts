import { EventTime } from "../main.models";


export class Results {
    private _countDown: EventTime;
    public get countDown() {
        return this._countDown;
    }
    public set countDown(evtTime: EventTime) {
        this._countDown = evtTime;
    }
    private _nextEventDuration: number;
    public get nextEventDuration() {
        return this._nextEventDuration;
    }
    public set nextEventDuration(duration: number) {
        this._nextEventDuration = duration;
    }
    private _nextEventNumber: number;
    public get nextEventNumber() {
        return this._nextEventNumber;
    }
    public set nextEventNumber(id: number) {
        this._nextEventNumber = id;
    }
    private _isDuplicatedEvent: boolean;
    public get isDuplicatedEvent() {
        return this._isDuplicatedEvent;
    }
    public set isDuplicatedEvent(isDuplicated: boolean) {
        this._isDuplicatedEvent = isDuplicated;
    }
    
    /**
     * If countDown is not instantly retrieved use nextEventDuration in place
     */
    public get countDownInSeconds(): number {
        if (this.countDown) {
            return this.countDown.minute * 60 + this.countDown.second;
        }
        return (this.nextEventDuration && this.nextEventDuration > 0) ? this.nextEventDuration : 120;
    }

    private _currentEventVideoDuration: number;
    public get currentEventVideoDuration(): number {
        return this._currentEventVideoDuration;
    }

    public set currentEventVideoDuration(duration: number) {
        this._currentEventVideoDuration = duration;
    }

    constructor() {
    }


}
