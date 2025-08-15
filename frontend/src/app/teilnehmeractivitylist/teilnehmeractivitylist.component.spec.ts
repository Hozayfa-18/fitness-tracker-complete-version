import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeilnehmeractivitylistComponent } from './teilnehmeractivitylist.component';

describe('TeilnehmeractivitylistComponent', () => {
  let component: TeilnehmeractivitylistComponent;
  let fixture: ComponentFixture<TeilnehmeractivitylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeilnehmeractivitylistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeilnehmeractivitylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
