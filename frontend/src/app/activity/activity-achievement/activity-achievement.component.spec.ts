import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityAchievementComponent } from './activity-achievement.component';

describe('ActivityAchievementComponent', () => {
  let component: ActivityAchievementComponent;
  let fixture: ComponentFixture<ActivityAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityAchievementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
