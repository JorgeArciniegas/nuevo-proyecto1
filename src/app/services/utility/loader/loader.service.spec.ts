import { TestBed } from "@angular/core/testing";
import { LoaderService, OperationData } from "./loader.service";

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoaderService,
      ],
    });

    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get operationDataDetailOdds', () => {
    const data: OperationData = { name: 'test', isLoading: true };

    service.operationDataDetailOdds = data;
    expect(service.operationDataDetailOdds).toEqual(data);
  });

  it('should set isLoading true', () => {
    const actived: boolean = true;
    const operation: string = 'https://vg-apidemo.vg-services.net/api/account/operators';
    const expectedOperationData: OperationData = {
      name: operation,
      isLoading: actived
    }

    service.setLoading(actived, operation);

    expect(service.operationDataDetailOdds).toEqual(expectedOperationData);
    expect(service.isLoading.getValue()).toEqual(true);
  });

  it('should set isLoading false', () => {
    const actived: boolean = false;
    const operation: string = 'https://vg-apidemo.vg-services.net/api/account/operators';
    const expectedOperationData: OperationData = {
      name: operation,
      isLoading: actived
    }

    service.setLoading(actived, operation);

    expect(service.operationDataDetailOdds).toEqual(expectedOperationData);
    expect(service.isLoading.getValue()).toEqual(false);
  });

});
