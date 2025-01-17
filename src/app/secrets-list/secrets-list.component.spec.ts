import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretsListComponent } from './secrets-list.component';

describe('SecretsListComponent', () => {
  let component: SecretsListComponent;
  let fixture: ComponentFixture<SecretsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecretsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecretsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
