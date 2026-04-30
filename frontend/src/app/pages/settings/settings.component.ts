import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccessibilityService } from '../../services/accessibility.service';
import { UserProfile, UserService } from '../../services/user.service';

type BooleanAccessibilitySetting =
  | 'reducedMotion'
  | 'largeTargets'
  | 'underlineLinks'
  | 'readableFont'
  | 'screenReaderMode'
  | 'showTranscripts';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  profile: UserProfile | null = null;
  saving = false;
  colorFilters = ['default', 'warm', 'cool', 'grayscale'];
  textSizes = ['small', 'medium', 'large', 'extra-large'];

  constructor(
    private userService: UserService,
    private router: Router,
    private accessibilityService: AccessibilityService
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getCurrentUser().subscribe({
      next: (profile) => {
        this.profile = {
          ...profile,
          settings: this.accessibilityService.normalizeSettings(profile.settings)
        };
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  updateContrast(): void {
    if (!this.profile) return;
    this.persistSettings({ highContrast: this.profile.settings.highContrast });
  }

  updateFilter(filter: string): void {
    if (!this.profile) return;
    this.profile.settings.colorFilter = filter;
    this.persistSettings({ colorFilter: filter });
  }

  updateTextSize(size: string): void {
    if (!this.profile) return;
    this.profile.settings.textSize = size;
    this.persistSettings({ textSize: size });
  }

  updateBooleanSetting(setting: BooleanAccessibilitySetting): void {
    if (!this.profile) return;
    this.persistSettings({ [setting]: this.profile.settings[setting] });
  }

  getColorFilterLabel(filter: string): string {
    switch (filter) {
      case 'warm':
        return 'Calido';
      case 'cool':
        return 'Frio';
      case 'grayscale':
        return 'Escala de grises';
      default:
        return 'Normal';
    }
  }

  getTextSizeLabel(size: string): string {
    switch (size) {
      case 'small':
        return 'Pequeno';
      case 'large':
        return 'Grande';
      case 'extra-large':
        return 'Muy grande';
      default:
        return 'Mediano';
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.accessibilityService.reset();
    this.router.navigate(['/login']);
  }

  private persistSettings(payload: Partial<UserProfile['settings']>): void {
    if (!this.profile) return;

    const previousSettings = this.profile.settings;
    const optimisticSettings = this.accessibilityService.normalizeSettings({
      ...previousSettings,
      ...payload
    });

    this.profile.settings = optimisticSettings;
    this.accessibilityService.persistUserSettings(optimisticSettings);
    this.saving = true;

    this.userService.updateSettings(payload).subscribe({
      next: ({ settings }) => {
        if (this.profile) {
          this.profile.settings = this.accessibilityService.normalizeSettings({
            ...optimisticSettings,
            ...settings,
            ...payload
          });
          this.accessibilityService.persistUserSettings(this.profile.settings);
        }
        this.saving = false;
      },
      error: () => {
        if (this.profile) {
          this.profile.settings = previousSettings;
          this.accessibilityService.persistUserSettings(previousSettings);
        }
        this.saving = false;
      }
    });
  }
}
