import { TestBed } from '@angular/core/testing';

import { ThirdPartyService } from './third-party.service';

describe('ThirdPartyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThirdPartyService = TestBed.get(ThirdPartyService);
    expect(service).toBeTruthy();
  });
});
