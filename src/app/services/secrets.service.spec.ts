import { TestBed } from '@angular/core/testing';

import { KeyVaultService } from './keyvault.service';

describe('SecretsService', () => {
  let service: KeyVaultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyVaultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
