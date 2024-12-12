export class RouterStub {
  navigateByUrl = jasmine.createSpy('navigateByUrl').and.returnValue(Promise.resolve());
  navigate = jasmine.createSpy('navigate').and.returnValue(Promise.resolve());
};

export class RouterServiceStub {
  router: RouterStub;

  constructor() {
    this.router = new RouterStub();
  };

  getRouter() {
    return this.router;
  };
  callBackToBrand() {};
};
