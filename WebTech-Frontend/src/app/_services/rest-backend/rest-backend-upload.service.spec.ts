import { TestBed } from '@angular/core/testing';

import { RestBackendUploadService } from './rest-backend-upload.service';

describe('RestBackendUploadService', () => {
  let service: RestBackendUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestBackendUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
