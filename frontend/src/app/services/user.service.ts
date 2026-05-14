import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AccessibilityService } from './accessibility.service';
import { API_BASE_URL } from './api-url';

export interface UserUpload {
  quoteId?: string | null;
  title: string;
  image: string;
  type: string;
}

export interface UserSettings {
  colorFilter: string;
  highContrast: boolean;
  textSize: string;
  reducedMotion: boolean;
  largeTargets: boolean;
  underlineLinks: boolean;
  readableFont: boolean;
}

export interface SavedQuote {
  _id: string;
  text: string;
  workTitle: string;
  year: number;
  rating: number;
  ratingsCount: number;
  views: string;
  image: string;
  mediaType: 'video' | 'audio';
  duration: string;
  actorName: string;
  characterName: string;
  accessibilityText: string;
  hashtags: string[];
  category: string;
}

export interface RatedQuote {
  quoteId: string;
  value: number;
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
  ratedQuotes: RatedQuote[];
  settings: UserSettings;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${API_BASE_URL}/auth`;

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
          const storedSettings = this.getStoredUser()?.settings;
          const mergedSettings = this.accessibilityService.normalizeSettings({
            ...storedSettings,
            ...settings,
            ...payload
          });
          this.accessibilityService.persistUserSettings(mergedSettings);
        })
      );
  }

  updatePassword(payload: { currentPassword: string; newPassword: string }): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/password`, payload, {
      headers: this.getHeaders()
    });
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

  syncRatedQuotes(ratedQuotes: RatedQuote[]): void {
    const savedUser = localStorage.getItem('user');

    if (!savedUser) {
      return;
    }

    try {
      const parsed = JSON.parse(savedUser) as Record<string, unknown>;
      parsed['ratedQuotes'] = ratedQuotes;
      localStorage.setItem('user', JSON.stringify(parsed));
    } catch {
      return;
    }
  }

  getStoredUser(): Partial<UserProfile> | null {
    const savedUser = localStorage.getItem('user');

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser) as Partial<UserProfile>;
    } catch {
      return null;
    }
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  private persistUser(profile: UserProfile): void {
    const storedSettings = this.getStoredUser()?.settings;
    const settings = this.accessibilityService.normalizeSettings({
      ...storedSettings,
      ...profile.settings
    });

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
        ratedQuotes: profile.ratedQuotes,
        settings,
        role: profile.role
      })
    );

    this.accessibilityService.persistUserSettings(settings);
  }
}
