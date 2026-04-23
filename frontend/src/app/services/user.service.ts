import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AccessibilityService } from './accessibility.service';

export interface UserUpload {
  title: string;
  image: string;
  type: string;
}

export interface UserSettings {
  colorFilter: string;
  highContrast: boolean;
  textSize: string;
}

export interface SavedQuote {
  _id: string;
  text: string;
  workTitle: string;
  year: number;
  image: string;
  mediaType: 'video' | 'audio';
  duration: string;
}

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  uploadsCount: number;
  downloads: number;
  uploads: UserUpload[];
  savedQuotes: SavedQuote[];
  settings: UserSettings;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient, private accessibilityService: AccessibilityService) {}

  getCurrentUser(): Observable<UserProfile> {
    return this.http
      .get<UserProfile>(`${this.apiUrl}/me`, {
        headers: this.getHeaders()
      })
      .pipe(
        tap((profile) => {
          this.persistUser(profile);
        })
      );
  }

  updateProfile(payload: { username?: string; avatar?: string }): Observable<{ message: string; user: UserProfile }> {
    return this.http
      .put<{ message: string; user: UserProfile }>(`${this.apiUrl}/profile`, payload, {
        headers: this.getHeaders()
      })
      .pipe(
        tap(({ user }) => {
          this.persistUser(user);
        })
      );
  }

  updateSettings(payload: Partial<UserSettings>): Observable<{ message: string; settings: UserSettings }> {
    return this.http
      .put<{ message: string; settings: UserSettings }>(`${this.apiUrl}/settings`, payload, {
        headers: this.getHeaders()
      })
      .pipe(
        tap(({ settings }) => {
          this.accessibilityService.persistUserSettings(settings);
        })
      );
  }

  syncSavedQuotes(savedQuoteIds: string[]): void {
    const savedUser = localStorage.getItem('user');

    if (!savedUser) {
      return;
    }

    try {
      const parsed = JSON.parse(savedUser) as Record<string, unknown>;
      const currentSavedQuotes = Array.isArray(parsed['savedQuotes']) ? (parsed['savedQuotes'] as Array<Record<string, unknown>>) : [];

      parsed['savedQuotes'] = currentSavedQuotes.filter((savedQuote) => {
        const savedId = savedQuote?.['_id'];
        return typeof savedId === 'string' && savedQuoteIds.includes(savedId);
      });

      localStorage.setItem('user', JSON.stringify(parsed));
    } catch {
      return;
    }
  }

  syncPublishedUpload(payload: { uploadsCount: number; uploads: UserUpload[] }): void {
    const savedUser = localStorage.getItem('user');

    if (!savedUser) {
      return;
    }

    try {
      const parsed = JSON.parse(savedUser) as Record<string, unknown>;
      parsed['uploadsCount'] = payload.uploadsCount;
      parsed['uploads'] = payload.uploads;
      localStorage.setItem('user', JSON.stringify(parsed));
    } catch {
      return;
    }
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  private persistUser(profile: UserProfile): void {
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: profile._id,
        username: profile.username,
        email: profile.email,
        avatar: profile.avatar,
        uploadsCount: profile.uploadsCount,
        downloads: profile.downloads,
        uploads: profile.uploads,
        savedQuotes: profile.savedQuotes,
        settings: profile.settings,
        role: profile.role
      })
    );

    this.accessibilityService.persistUserSettings(profile.settings);
  }
}
