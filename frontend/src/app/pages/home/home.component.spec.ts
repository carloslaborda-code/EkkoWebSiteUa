/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';
import { QuoteService } from '../../services/quotes.services';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let quoteServiceStub: jasmine.SpyObj<QuoteService>;

  beforeEach(() => {
    quoteServiceStub = jasmine.createSpyObj<QuoteService>('QuoteService', ['getQuotes']);
    quoteServiceStub.getQuotes.and.returnValue(of([]));
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [FormsModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: QuoteService, useValue: quoteServiceStub }]
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
