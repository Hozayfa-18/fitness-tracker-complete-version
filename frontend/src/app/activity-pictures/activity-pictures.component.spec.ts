import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityPicturesComponent } from './activity-pictures.component';

describe('ActivityPicturesComponent', () => {
  let component: ActivityPicturesComponent;
  let fixture: ComponentFixture<ActivityPicturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityPicturesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityPicturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
