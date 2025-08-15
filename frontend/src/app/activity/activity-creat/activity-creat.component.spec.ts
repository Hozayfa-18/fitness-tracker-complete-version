import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCreatComponent } from './activity-creat.component';

describe('ActivityComponent', () => {
  let component: ActivityCreatComponent;
  let fixture: ComponentFixture<ActivityCreatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityCreatComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ActivityCreatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

