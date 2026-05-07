import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccessibilityService } from '../../services/accessibility.service';
import { UserProfile, UserService } from '../../services/user.service';
import { faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';

type BooleanAccessibilitySetting =
  | 'reducedMotion'
  | 'largeTargets'
  | 'underlineLinks'
  | 'readableFont';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  profile: UserProfile | null = null;
  saving = false;
  accountConfigOpen = false;
  passwordSaving = false;
  passwordMessage = '';
  passwordError = false;
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  colorFilters = ['default', 'warm', 'cool', 'grayscale'];
  textSizes = ['small', 'medium', 'large', 'extra-large'];
  readonly faChevronLeft = faChevronLeft;
  readonly faChevronRight = faChevronRight;

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

  trackByValue(_index: number, value: string): string {
    return value;
  }

  toggleAccountConfig(): void {
    this.accountConfigOpen = !this.accountConfigOpen;
  }

  submitPasswordChange(): void {
    if (!this.profile || this.passwordSaving) return;

    this.passwordMessage = '';
    this.passwordError = false;

    if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
      this.passwordError = true;
      this.passwordMessage = 'Completa los tres campos para cambiar la contrasena.';
      return;
    }

    if (this.passwordForm.newPassword.length < 6) {
      this.passwordError = true;
      this.passwordMessage = 'La nueva contrasena debe tener al menos 6 caracteres.';
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.passwordError = true;
      this.passwordMessage = 'La confirmacion no coincide con la nueva contrasena.';
      return;
    }

    this.passwordSaving = true;

    this.userService
      .updatePassword({
        currentPassword: this.passwordForm.currentPassword,
        newPassword: this.passwordForm.newPassword
      })
      .subscribe({
        next: ({ message }) => {
          this.passwordSaving = false;
          this.passwordError = false;
          this.passwordMessage = message || 'Contrasena actualizada correctamente.';
          this.passwordForm = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          };
        },
        error: (error) => {
          this.passwordSaving = false;
          this.passwordError = true;
          this.passwordMessage = error?.error?.message || 'No se pudo actualizar la contrasena.';
        }
      });
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
