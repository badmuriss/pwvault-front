import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSecretModalComponent } from './create-secret-modal.component';

describe('CreateSecretModalComponent', () => {
  let component: CreateSecretModalComponent;
  let fixture: ComponentFixture<CreateSecretModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSecretModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSecretModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
