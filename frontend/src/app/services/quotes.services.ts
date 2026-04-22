import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Quote {
  _id: string;
  text: string;
  workTitle: string;
  year: number;
  rating: number;
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

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private apiUrl = 'http://localhost:5000/api/quotes';

  constructor(private http: HttpClient) {}

  getQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(this.apiUrl);
  }

  getQuoteById(id: string): Observable<Quote> {
    return this.http.get<Quote>(`${this.apiUrl}/${id}`);
  }

  toggleSave(id: string): Observable<{ message: string; saved: boolean; savedCount: number; savedQuoteIds: string[] }> {
    return this.http.post<{ message: string; saved: boolean; savedCount: number; savedQuoteIds: string[] }>(`${this.apiUrl}/${id}/save`, {}, {
      headers: this.getHeaders()
    });
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
