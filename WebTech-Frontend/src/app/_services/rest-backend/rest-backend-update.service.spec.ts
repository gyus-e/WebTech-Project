import { TestBed } from '@angular/core/testing';

import { RestBackendUpdateService } from './rest-backend-update.service';

describe('RestBackendUpdateService', () => {
  let service: RestBackendUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestBackendUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
