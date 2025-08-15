import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenutzerprofileComponent } from './benutzerprofile.component';

describe('BenutzerprofileComponent', () => {
  let component: BenutzerprofileComponent;
  let fixture: ComponentFixture<BenutzerprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenutzerprofileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BenutzerprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
