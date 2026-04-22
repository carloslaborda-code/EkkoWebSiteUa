import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { UserSettings } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  initializeFromStorage(): void {
    const savedUser = localStorage.getItem('user');

    if (!savedUser) {
      this.applyTextSize('medium');
      return;
    }

    try {
      const parsed = JSON.parse(savedUser) as { settings?: Partial<UserSettings> };
      this.applyTextSize(parsed.settings?.textSize || 'medium');
    } catch {
      this.applyTextSize('medium');
    }
  }

  persistUserSettings(settings: UserSettings): void {
    const savedUser = localStorage.getItem('user');

    if (!savedUser) {
      localStorage.setItem('user', JSON.stringify({ settings }));
      this.applyTextSize(settings.textSize);
      return;
    }

    try {
      const parsed = JSON.parse(savedUser) as Record<string, unknown>;
      parsed['settings'] = settings;
      localStorage.setItem('user', JSON.stringify(parsed));
    } catch {
      localStorage.setItem('user', JSON.stringify({ settings }));
    }

    this.applyTextSize(settings.textSize);
  }

  reset(): void {
    this.applyTextSize('medium');
  }

  applyTextSize(size: string): void {
    const root = this.document.documentElement;
    const mappedSize = this.getFontSize(size);

    root.style.fontSize = mappedSize;
    root.setAttribute('data-text-size', size);
  }

  private getFontSize(size: string): string {
    switch (size) {
      case 'small':
        return '14px';
      case 'large':
        return '18px';
      default:
        return '16px';
    }
  }
}
