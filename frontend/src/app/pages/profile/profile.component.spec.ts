import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ProfileComponent } from './profile.component';
import { UserService } from '../../services/user.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [RouterTestingModule],
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
                  readableFont: false,
                  screenReaderMode: false,
                  showTranscripts: false
                },
                role: 'user'
              })
          }
        }
      ]
    });
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
