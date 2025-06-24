import { TestBed } from '@angular/core/testing';

import { CatsStateService } from './cats-state.service';

describe('CatsStateService', () => {
  let service: CatsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
