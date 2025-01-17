import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretDetailComponent } from './secret-detail.component';

describe('SecretDetailComponent', () => {
  let component: SecretDetailComponent;
  let fixture: ComponentFixture<SecretDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecretDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecretDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
