import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-url';

interface AuthPayload {
  email: string;
  password?: string;
  username?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    uploadsCount?: number;
    downloads?: number;
    settings?: {
      colorFilter: string;
      highContrast: boolean;
      textSize: string;
      reducedMotion: boolean;
      largeTargets: boolean;
      underlineLinks: boolean;
      readableFont: boolean;
      screenReaderMode: boolean;
      showTranscripts: boolean;
    };
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API = `${API_BASE_URL}/auth`;

  constructor(private http: HttpClient) {}

  login(data: AuthPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/login`, data);
  }

  register(data: AuthPayload) {
    return this.http.post(`${this.API}/register`, data);
  }
}
