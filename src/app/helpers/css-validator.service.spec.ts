import { TestBed } from '@angular/core/testing';

import { CssValidatorService } from './css-validator.service';

describe('CssValidatorService', () => {
  let service: CssValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CssValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
