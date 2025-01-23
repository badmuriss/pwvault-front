import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretEditComponent } from './secret-edit.component';

describe('SecretEditComponent', () => {
  let component: SecretEditComponent;
  let fixture: ComponentFixture<SecretEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecretEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecretEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
