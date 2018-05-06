import { TestBed, inject } from '@angular/core/testing';

import { RegisteredDoctorsService } from './registered-doctors.service';

describe('RegisteredDoctorsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegisteredDoctorsService]
    });
  });

  it('should be created', inject([RegisteredDoctorsService], (service: RegisteredDoctorsService) => {
    expect(service).toBeTruthy();
  }));
});
