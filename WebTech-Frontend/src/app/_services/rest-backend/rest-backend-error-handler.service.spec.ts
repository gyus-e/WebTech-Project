import { TestBed } from '@angular/core/testing';

import { RestBackendErrorHandlerService } from './rest-backend-error-handler.service';

describe('RestBackendErrorHandlerService', () => {
  let service: RestBackendErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestBackendErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
