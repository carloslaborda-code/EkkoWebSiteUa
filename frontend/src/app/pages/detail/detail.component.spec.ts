import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DetailComponent } from './detail.component';
import { QuoteService } from '../../services/quotes.services';
import { UserService } from '../../services/user.service';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailComponent],
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: QuoteService,
          useValue: {
            getQuoteById: () =>
              of({
                _id: '1',
                text: 'The eyes, chico. They never lie.',
                workTitle: 'Scarface',
                year: 1983,
                rating: 4.5,
                ratingsCount: 12,
                views: '1.2M',
                image: '/assets/images/scarface.jpg',
                mediaType: 'video',
                mediaUrl: '/assets/media/scarfacevideo.mp4',
                duration: '01:22:15',
                actorName: 'Al Pacino',
                characterName: 'Tony Montana',
                synopsis: 'Synopsis',
                accessibilityText: 'Transcripcion accesible',
                hashtags: [],
                category: 'movie'
              }),
            toggleSave: () => of({ message: 'ok', saved: true, savedCount: 1, savedQuoteIds: ['1'] }),
            rateQuote: () => of({ message: 'ok', rating: 4.6, ratingsCount: 13, ratedQuotes: [{ quoteId: '1', value: 5 }] }),
            registerDownload: () => of({ message: 'ok', mediaUrl: '/assets/media/scarfacevideo.mp4' }),
            registerView: () => of({ message: 'ok', views: '1.2M' })
          }
        },
        {
          provide: UserService,
          useValue: {
            getCurrentUser: () => of({ savedQuotes: [], ratedQuotes: [] }),
            getStoredUser: () => null,
            syncSavedQuotes: () => undefined,
            syncRatedQuotes: () => undefined
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ]
    });
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
