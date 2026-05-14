import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AdminComponent } from './admin.component';
import { QuoteService } from '../../services/quotes.services';
import { UserService } from '../../services/user.service';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(() => {
    localStorage.setItem('token', 'token');

    TestBed.configureTestingModule({
      declarations: [AdminComponent],
      imports: [FormsModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: QuoteService,
          useValue: {
            getQuotes: () => of([]),
            updateQuoteAccessibility: () => of({ message: 'ok', quote: {} }),
            deleteQuote: () => of({ message: 'ok', deletedQuoteId: '1' })
          }
        },
        {
          provide: UserService,
          useValue: {
            getCurrentUser: () => of({ role: 'admin' })
          }
        }
      ]
    });

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('token');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
