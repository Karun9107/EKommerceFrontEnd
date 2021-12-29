import { TestBed } from '@angular/core/testing';

import { EKommerceFormService } from './ekommerce-form.service';

describe('EKommerceFormService', () => {
  let service: EKommerceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EKommerceFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
