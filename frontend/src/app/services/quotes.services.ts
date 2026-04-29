import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { UserUpload } from './user.service';
import { API_BASE_URL } from './api-url';

export interface Quote {
  _id: string;
  text: string;
  workTitle: string;
  year: number;
  rating: number;
  ratingsCount: number;
  views: string;
  image: string;
  mediaType: 'video' | 'audio';
  mediaUrl: string;
  duration: string;
  actorName: string;
  characterName: string;
  synopsis: string;
  hashtags: string[];
  category: string;
}

export interface CreateQuotePayload {
  text: string;
  workTitle: string;
  year: number;
  rating?: number;
  views?: string;
  image: string;
  mediaType: 'video' | 'audio';
  mediaUrl: string;
  duration: string;
  actorName: string;
  characterName: string;
  synopsis: string;
  hashtags: string[];
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private apiUrl = `${API_BASE_URL}/quotes`;
  private quotesCache$?: Observable<Quote[]>;
  private quoteByIdCache = new Map<string, Observable<Quote>>();

  constructor(private http: HttpClient) {}

  getQuotes(forceRefresh = false): Observable<Quote[]> {
    if (!this.quotesCache$ || forceRefresh) {
      this.quotesCache$ = this.http.get<Quote[]>(this.apiUrl).pipe(
        tap((quotes) => {
          quotes.forEach((quote) => this.normalizeQuote(quote));
        }),
        shareReplay(1)
      );
    }

    return this.quotesCache$;
  }

  getQuoteById(id: string): Observable<Quote> {
    const cachedQuote = this.quoteByIdCache.get(id);
    if (cachedQuote) {
      return cachedQuote;
    }

    const request$ = this.http.get<Quote>(`${this.apiUrl}/${id}`).pipe(
      tap((quote) => this.normalizeQuote(quote)),
      shareReplay(1)
    );

    this.quoteByIdCache.set(id, request$);
    return request$;
  }

  createQuote(payload: CreateQuotePayload): Observable<{ message: string; quote: Quote; user: { uploadsCount: number; uploads: UserUpload[] } }> {
    return this.http
      .post<{ message: string; quote: Quote; user: { uploadsCount: number; uploads: UserUpload[] } }>(this.apiUrl, payload, {
        headers: this.getHeaders()
      })
      .pipe(
        tap(() => {
          this.clearQuotesCache();
        })
      );
  }

  toggleSave(id: string): Observable<{ message: string; saved: boolean; savedCount: number; savedQuoteIds: string[] }> {
    return this.http.post<{ message: string; saved: boolean; savedCount: number; savedQuoteIds: string[] }>(`${this.apiUrl}/${id}/save`, {}, {
      headers: this.getHeaders()
    });
  }

  rateQuote(id: string, value: number): Observable<{ message: string; rating: number; ratingsCount: number; ratedQuotes: { quoteId: string; value: number }[] }> {
    return this.http.post<{ message: string; rating: number; ratingsCount: number; ratedQuotes: { quoteId: string; value: number }[] }>(`${this.apiUrl}/${id}/rate`, { value }, {
      headers: this.getHeaders()
    }).pipe(
      tap(({ rating, ratingsCount }) => {
        this.patchCachedQuote(id, { rating, ratingsCount });
      })
    );
  }

  registerView(id: string): Observable<{ message: string; views: string }> {
    return this.http.post<{ message: string; views: string }>(`${this.apiUrl}/${id}/view`, {}).pipe(
      tap(({ views }) => {
        this.patchCachedQuote(id, { views });
      })
    );
  }

  registerDownload(id: string): Observable<{ message: string; mediaUrl: string }> {
    return this.http.post<{ message: string; mediaUrl: string }>(`${this.apiUrl}/${id}/download`, {}, {
      headers: this.getHeaders()
    });
  }

  clearQuotesCache(): void {
    this.quotesCache$ = undefined;
    this.quoteByIdCache.clear();
  }

  private normalizeQuote(quote: Quote): Quote {
    quote.text = typeof quote.text === 'string' ? quote.text : '';
    quote.workTitle = typeof quote.workTitle === 'string' ? quote.workTitle : '';
    quote.year = typeof quote.year === 'number' && Number.isFinite(quote.year) ? quote.year : 0;
    quote.rating = typeof quote.rating === 'number' && Number.isFinite(quote.rating) ? quote.rating : 0;
    quote.ratingsCount = typeof quote.ratingsCount === 'number' && Number.isFinite(quote.ratingsCount) ? quote.ratingsCount : 0;
    quote.views = typeof quote.views === 'string' && quote.views.trim() ? quote.views : '0';
    quote.image = typeof quote.image === 'string' ? quote.image : '';
    quote.mediaUrl = typeof quote.mediaUrl === 'string' ? quote.mediaUrl : '';
    quote.duration = typeof quote.duration === 'string' && quote.duration.trim() ? quote.duration : '00:00';
    quote.actorName = typeof quote.actorName === 'string' ? quote.actorName : '';
    quote.characterName = typeof quote.characterName === 'string' ? quote.characterName : '';
    quote.synopsis = typeof quote.synopsis === 'string' ? quote.synopsis : '';
    quote.hashtags = Array.isArray(quote.hashtags) ? quote.hashtags : [];
    quote.category = typeof quote.category === 'string' && quote.category.trim() ? quote.category : 'movie';
    quote.mediaType = quote.mediaType === 'audio' ? 'audio' : 'video';
    return quote;
  }

  private patchCachedQuote(id: string, patch: Partial<Quote>): void {
    const cachedDetail = this.quoteByIdCache.get(id);

    if (cachedDetail) {
      const patchedDetail$ = cachedDetail.pipe(
        tap((quote) => Object.assign(quote, patch)),
        shareReplay(1)
      );
      this.quoteByIdCache.set(id, patchedDetail$);
    }

    if (!this.quotesCache$) {
      return;
    }

    this.quotesCache$ = this.quotesCache$.pipe(
      tap((quotes) => {
        const targetQuote = quotes.find((quote) => quote._id === id);
        if (targetQuote) {
          Object.assign(targetQuote, patch);
        }
      }),
      shareReplay(1)
    );
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
