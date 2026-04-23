/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PublishComponent } from './publish.component';
import { QuoteService } from '../../services/quotes.services';

describe('PublishComponent', () => {
  let component: PublishComponent;
  let fixture: ComponentFixture<PublishComponent>;
  let quoteServiceStub: jasmine.SpyObj<QuoteService>;

  beforeEach(() => {
    quoteServiceStub = jasmine.createSpyObj<QuoteService>('QuoteService', ['createQuote']);
    quoteServiceStub.createQuote.and.returnValue(
      of({
        message: 'ok',
        quote: {
          _id: '1',
          text: 'quote',
          workTitle: 'title',
          year: 1983,
          rating: 0,
          views: '0',
          image: '',
          mediaType: 'audio',
          mediaUrl: '',
          duration: '00:00',
          actorName: 'actor',
          characterName: 'character',
          synopsis: 'synopsis',
          hashtags: [],
          category: 'movie'
        }
      })
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublishComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [{ provide: QuoteService, useValue: quoteServiceStub }]
    });

    fixture = TestBed.createComponent(PublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
