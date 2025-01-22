import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenFailComponent } from './token-fail.component';

describe('TokenFailComponent', () => {
  let component: TokenFailComponent;
  let fixture: ComponentFixture<TokenFailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenFailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
