import { TestBed } from '@angular/core/testing';

import { RestBackendFetchService } from './rest-backend-fetch.service';

describe('RestBackendFetchService', () => {
  let service: RestBackendFetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestBackendFetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
