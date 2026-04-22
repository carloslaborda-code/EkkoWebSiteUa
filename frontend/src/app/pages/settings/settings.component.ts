import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccessibilityService } from '../../services/accessibility.service';
import { UserProfile, UserService } from '../../services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  profile: UserProfile | null = null;
  saving = false;
  colorFilters = ['default', 'warm', 'cool'];
  textSizes = ['small', 'medium', 'large'];

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
        this.profile = profile;
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

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.accessibilityService.reset();
    this.router.navigate(['/login']);
  }

  private persistSettings(payload: { colorFilter?: string; highContrast?: boolean; textSize?: string }): void {
    this.saving = true;
    this.userService.updateSettings(payload).subscribe({
      next: ({ settings }) => {
        if (this.profile) {
          this.profile.settings = settings;
        }
        this.saving = false;
      },
      error: () => {
        this.saving = false;
      }
    });
  }
}
