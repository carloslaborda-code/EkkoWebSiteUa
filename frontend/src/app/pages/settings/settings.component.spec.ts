import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { SettingsComponent } from './settings.component';
import { UserService } from '../../services/user.service';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        {
          provide: UserService,
          useValue: {
            getCurrentUser: () =>
              of({
                _id: '1',
                username: 'Alex Garcia',
                email: 'alex@example.com',
                avatar: '',
                uploadsCount: 12,
                downloads: 45,
                uploads: [],
                savedQuotes: [],
                settings: {
                  colorFilter: 'default',
                  highContrast: false,
                  textSize: 'medium',
                  reducedMotion: false,
                  largeTargets: false,
                  underlineLinks: false,
                  readableFont: false
                },
                role: 'user'
              }),
            updateSettings: () =>
              of({
                message: 'ok',
                settings: {
                  colorFilter: 'default',
                  highContrast: false,
                  textSize: 'medium',
                  reducedMotion: false,
                  largeTargets: false,
                  underlineLinks: false,
                  readableFont: false
                }
              })
          }
        }
      ]
    });
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
