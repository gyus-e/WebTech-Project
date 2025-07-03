import { TestBed } from '@angular/core/testing';

import { RestBackendDeleteService } from './rest-backend-delete.service';

describe('RestBackendDeleteService', () => {
  let service: RestBackendDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestBackendDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
