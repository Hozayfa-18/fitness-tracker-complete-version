import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeilnehmersucheprofileComponent } from './teilnehmersucheprofile.component';

describe('TeilnehmersucheprofileComponent', () => {
  let component: TeilnehmersucheprofileComponent;
  let fixture: ComponentFixture<TeilnehmersucheprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeilnehmersucheprofileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeilnehmersucheprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
