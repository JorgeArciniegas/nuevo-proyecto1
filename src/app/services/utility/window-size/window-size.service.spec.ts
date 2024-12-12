import { TestBed } from '@angular/core/testing';
import { WindowSizeService } from './window-size.service';

describe('WindowSizeService', () => {
  let service: WindowSizeService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [],
        providers: [],
    });

    service = TestBed.inject(WindowSizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('initWindowSize() should create WindowSize object', () => {
    const expected = [
      'height',
      'width',
      'aspectRatio',
      'columnHeight',
    ].sort();
    service.initWindowSize();
    expect(service.windowSize).toBeTruthy();
    expect(Object.keys(service.windowSize).sort()).toEqual(expected);
  });

});