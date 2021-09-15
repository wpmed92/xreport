import { TestBed } from '@angular/core/testing';

import { NavVisibilityService } from './nav-visibility.service';

describe('NavVisibilityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavVisibilityService = TestBed.get(NavVisibilityService);
    expect(service).toBeTruthy();
  });
});
