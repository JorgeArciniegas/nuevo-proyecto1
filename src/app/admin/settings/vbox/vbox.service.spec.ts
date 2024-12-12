import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { ElysApiService, VBoxConfiguration, VBoxConfigurationRequest, VBoxConfigurations } from "@elys/elys-api";
import { cloneData } from "src/app/mock/helpers/clone-mock.helper";
import { ElysApiServiceStub } from "src/app/mock/stubs/elys-api.stub";
import { mockVBoxConfigurations } from "src/app/mock/vbox.mock";
import { TranslateUtilityService } from "src/app/shared/language/translate-utility.service";
import { ListVbox, LocalVboxes } from "./vbox.model";
import { VboxService } from "./vbox.service";

class TranslateUtilityServiceStub {
  getCurrentLanguage = jasmine.createSpy('getCurrentLanguage').and.returnValue('it');
}

describe('VboxService', () => {
  let service: VboxService;
  let translateService: TranslateUtilityService;
  let elysApi: ElysApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VboxService,
        { provide: ElysApiService, useClass: ElysApiServiceStub },
        { provide: TranslateUtilityService, useClass: TranslateUtilityServiceStub }
      ],
    });

    service = TestBed.inject(VboxService);
    translateService = TestBed.inject(TranslateUtilityService);
    elysApi = TestBed.inject(ElysApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get list and set language', fakeAsync(() => {
    const vBoxConfigurations: VBoxConfigurations = cloneData(mockVBoxConfigurations);
    const configurations: LocalVboxes[] = cloneData(mockVBoxConfigurations.VBoxConfigurations);

    configurations.map(item => {
      item.language = item.MonitorConfigurations[0].Language;
    });

    elysApi.virtual.getVboxConfiguration =
      jasmine.createSpy('getVboxConfiguration').and.returnValue(Promise.resolve(vBoxConfigurations));

    service.getList();
    tick(100);

    expect(service.listVbox.vBoxConfigurations).toEqual(configurations);
    expect(service.listVbox.totalVboxs).toEqual(configurations.length);
  }));

  it('should get list and set default language', fakeAsync(() => {
    const configurations: LocalVboxes[] = cloneData(mockVBoxConfigurations.VBoxConfigurations);
    const vBoxConfigurations: VBoxConfigurations = cloneData(mockVBoxConfigurations);

    vBoxConfigurations.VBoxConfigurations[0].MonitorConfigurations[0].Language = null;
    elysApi.virtual.getVboxConfiguration =
      jasmine.createSpy('getVboxConfiguration').and.returnValue(Promise.resolve(vBoxConfigurations));

    configurations.map(item => {
      item.MonitorConfigurations[0].Language = null;
      item.language = translateService.getCurrentLanguage();
    });

    service.getList();
    tick(100);

    expect(translateService.getCurrentLanguage).toHaveBeenCalled();
    expect(service.listVbox.vBoxConfigurations).toEqual(configurations);
    expect(service.listVbox.totalVboxs).toEqual(configurations.length);
  }));

  it('should init load', () => {
    service.listVbox = {
      actualPages: 1,
      totalPages: 2,
      totalVboxs: 3,
      vBoxConfigurations: null
    };

    const expectedListVbox: ListVbox = {
      actualPages: 0,
      totalPages: 0,
      totalVboxs: 0,
      vBoxConfigurations: null
    };

    service.initLoad();
    expect(service.listVbox).toEqual(expectedListVbox);
  });

  it('should filter operators', () => {
    const configurations: VBoxConfiguration[] = cloneData(mockVBoxConfigurations.VBoxConfigurations);

    service.rowNumber = 1;
    service.listVbox = {
      actualPages: 0,
      totalPages: 2,
      totalVboxs: 2,
      vBoxConfigurations: configurations
    };

    service.filterOperators()
    expect(service.listTempVbox).toEqual(configurations);
  });

  it('should save data', () => {
    const request: VBoxConfigurationRequest = {
      VBoxConfiguration: service.vBoxSelected
    };

    service.saveData();
    expect(elysApi.virtual.postVboxConfiguration).toHaveBeenCalledWith(request);
  });

});
