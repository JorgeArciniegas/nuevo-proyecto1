import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { StorageService } from "../storage/storage.service";
import { RouterService } from "./router.service";
import { Location } from '@angular/common';
import { ElysStorageLibService } from "@elys/elys-storage-lib";
import { ElysStorageLibServiceStub } from "src/app/mock/stubs/elys-storage.stub";

class RouterStub {
  navigateByUrl = jasmine.createSpy('navigateByUrl');
}

describe('RouterService', () => {
  let service: RouterService;
  let router: Router;
  let storageService: StorageService;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RouterService,
        Location,
        { provide: Router, useClass: RouterStub },
        StorageService,
        { provide: ElysStorageLibService, useClass: ElysStorageLibServiceStub }
      ],
    });

    service = TestBed.inject(RouterService);
    router = TestBed.inject(Router);
    storageService = TestBed.inject(StorageService);
    location = TestBed.inject(Location);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return router object', () => {
    expect(service.getRouter()).toEqual(router);
  });

  it('should return back', () => {
    spyOn(location, 'back');

    service.getBack();
    expect(location.back).toHaveBeenCalled();
  });

  it('should navigate to error page', () => {
    service.callBackToBrand();
    expect(router.navigateByUrl).toHaveBeenCalledWith('error-page');
  });
});
