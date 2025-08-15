import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeilnehmerSucheComponent } from './teilnehmer-suche.component';

describe('TeilnehmerSucheComponent', () => {
  let component: TeilnehmerSucheComponent;
  let fixture: ComponentFixture<TeilnehmerSucheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeilnehmerSucheComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeilnehmerSucheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
