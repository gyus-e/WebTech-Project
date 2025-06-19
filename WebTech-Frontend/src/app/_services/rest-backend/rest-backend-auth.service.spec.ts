import { TestBed } from '@angular/core/testing';

import { RestBackendAuthService } from './rest-backend-auth.service';

describe('RestBackendAuthService', () => {
  let service: RestBackendAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestBackendAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
