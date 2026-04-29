import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  constructor(private http: HttpClient) {}

  getQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(this.apiUrl);
  }

  getQuoteById(id: string): Observable<Quote> {
    return this.http.get<Quote>(`${this.apiUrl}/${id}`);
  }

  createQuote(payload: CreateQuotePayload): Observable<{ message: string; quote: Quote; user: { uploadsCount: number; uploads: UserUpload[] } }> {
    return this.http.post<{ message: string; quote: Quote; user: { uploadsCount: number; uploads: UserUpload[] } }>(this.apiUrl, payload, {
      headers: this.getHeaders()
    });
  }

  toggleSave(id: string): Observable<{ message: string; saved: boolean; savedCount: number; savedQuoteIds: string[] }> {
    return this.http.post<{ message: string; saved: boolean; savedCount: number; savedQuoteIds: string[] }>(`${this.apiUrl}/${id}/save`, {}, {
      headers: this.getHeaders()
    });
  }

  rateQuote(id: string, value: number): Observable<{ message: string; rating: number; ratingsCount: number; ratedQuotes: { quoteId: string; value: number }[] }> {
    return this.http.post<{ message: string; rating: number; ratingsCount: number; ratedQuotes: { quoteId: string; value: number }[] }>(`${this.apiUrl}/${id}/rate`, { value }, {
      headers: this.getHeaders()
    });
  }

  registerView(id: string): Observable<{ message: string; views: string }> {
    return this.http.post<{ message: string; views: string }>(`${this.apiUrl}/${id}/view`, {});
  }

  registerDownload(id: string): Observable<{ message: string; mediaUrl: string }> {
    return this.http.post<{ message: string; mediaUrl: string }>(`${this.apiUrl}/${id}/download`, {}, {
      headers: this.getHeaders()
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
