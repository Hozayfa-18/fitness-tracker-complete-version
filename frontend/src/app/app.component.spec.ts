import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'frontend' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('frontend');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, frontend');
  });
});

// Sara tesst
// import { TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing'; // Importiere den RouterTestingModule
// import { AppComponent } from './app.component';
// import { NavbarComponent } from './navbar/navbar.component'; // Navbar-Komponente importieren
//
// describe('AppComponent', () => {
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [RouterTestingModule], // RouterTestingModule importieren, um Routing zu simulieren
//       declarations: [AppComponent, NavbarComponent], // Deklariere AppComponent und NavbarComponent
//     }).compileComponents();
//   });
//
//   it('should create the app', () => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.componentInstance;
//     expect(app).toBeTruthy();
//   });
//
//   it(`should have the title 'frontend'`, () => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.componentInstance;
//     expect(app.title).toEqual('frontend'); // Prüfen, ob `title` den erwarteten Wert hat
//   });
//
//   it('should render title', () => {
//     const fixture = TestBed.createComponent(AppComponent);
//     fixture.detectChanges();
//     const compiled = fixture.nativeElement as HTMLElement;
//     expect(compiled.querySelector('h1')?.textContent).toContain('Hello, frontend');
//   });
// });
