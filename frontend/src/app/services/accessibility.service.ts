import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { UserSettings } from './user.service';

const DEFAULT_ACCESSIBILITY_SETTINGS: UserSettings = {
  colorFilter: 'default',
  highContrast: false,
  textSize: 'medium',
  reducedMotion: false,
  largeTargets: false,
  underlineLinks: false,
  readableFont: false,
  screenReaderMode: false,
  showTranscripts: false
};

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  initializeFromStorage(): void {
    const savedUser = localStorage.getItem('user');

    if (!savedUser) {
      this.applySettings(DEFAULT_ACCESSIBILITY_SETTINGS);
      return;
    }

    try {
      const parsed = JSON.parse(savedUser) as { settings?: Partial<UserSettings> };
      this.applySettings(this.normalizeSettings(parsed.settings));
    } catch {
      this.applySettings(DEFAULT_ACCESSIBILITY_SETTINGS);
    }
  }

  persistUserSettings(settings: UserSettings): void {
    const normalizedSettings = this.normalizeSettings(settings);
    const savedUser = localStorage.getItem('user');

    if (!savedUser) {
      localStorage.setItem('user', JSON.stringify({ settings: normalizedSettings }));
      this.applySettings(normalizedSettings);
      return;
    }

    try {
      const parsed = JSON.parse(savedUser) as Record<string, unknown>;
      parsed['settings'] = normalizedSettings;
      localStorage.setItem('user', JSON.stringify(parsed));
    } catch {
      localStorage.setItem('user', JSON.stringify({ settings: normalizedSettings }));
    }

    this.applySettings(normalizedSettings);
  }

  reset(): void {
    this.applySettings(DEFAULT_ACCESSIBILITY_SETTINGS);
  }

  applySettings(settings: UserSettings): void {
    const root = this.document.documentElement;

    root.style.fontSize = this.getFontSize(settings.textSize);
    root.setAttribute('data-text-size', settings.textSize);
    root.setAttribute('data-color-filter', settings.colorFilter);
    root.setAttribute('data-high-contrast', String(settings.highContrast));
    root.setAttribute('data-reduced-motion', String(settings.reducedMotion));
    root.setAttribute('data-large-targets', String(settings.largeTargets));
    root.setAttribute('data-underline-links', String(settings.underlineLinks));
    root.setAttribute('data-readable-font', String(settings.readableFont));
    root.setAttribute('data-screen-reader-mode', String(settings.screenReaderMode));
    root.setAttribute('data-show-transcripts', String(settings.showTranscripts));
  }

  private getFontSize(size: string): string {
    switch (size) {
      case 'small':
        return '14px';
      case 'large':
        return '18px';
      case 'extra-large':
        return '20px';
      default:
        return '16px';
    }
  }

  normalizeSettings(settings?: Partial<UserSettings>): UserSettings {
    return {
      ...DEFAULT_ACCESSIBILITY_SETTINGS,
      ...settings,
      colorFilter: this.normalizeOption(settings?.colorFilter, ['default', 'warm', 'cool', 'grayscale'], 'default'),
      textSize: this.normalizeOption(settings?.textSize, ['small', 'medium', 'large', 'extra-large'], 'medium'),
      highContrast: Boolean(settings?.highContrast),
      reducedMotion: Boolean(settings?.reducedMotion),
      largeTargets: Boolean(settings?.largeTargets),
      underlineLinks: Boolean(settings?.underlineLinks),
      readableFont: Boolean(settings?.readableFont),
      screenReaderMode: Boolean(settings?.screenReaderMode),
      showTranscripts: Boolean(settings?.showTranscripts)
    };
  }

  private normalizeOption(value: unknown, allowedValues: string[], fallback: string): string {
    return typeof value === 'string' && allowedValues.includes(value) ? value : fallback;
  }
}
