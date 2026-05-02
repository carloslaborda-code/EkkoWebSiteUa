import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AccessibilityService } from './services/accessibility.service';

describe('AppComponent', () => {
  const accessibilityServiceMock = {
    initializeFromStorage: jasmine.createSpy('initializeFromStorage')
  };

  beforeEach(() => {
    accessibilityServiceMock.initializeFromStorage.calls.reset();

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        { provide: AccessibilityService, useValue: accessibilityServiceMock }
      ]
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize stored accessibility settings', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(accessibilityServiceMock.initializeFromStorage).toHaveBeenCalled();
  });

  it('should render navigation helpers', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.skip-link')?.textContent).toContain('Saltar al contenido principal');
  });
});
