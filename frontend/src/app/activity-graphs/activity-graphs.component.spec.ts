import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityGraphsComponent } from './activity-graphs.component';

describe('ActivityGraphsComponent', () => {
  let component: ActivityGraphsComponent;
  let fixture: ComponentFixture<ActivityGraphsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityGraphsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ActivityGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
