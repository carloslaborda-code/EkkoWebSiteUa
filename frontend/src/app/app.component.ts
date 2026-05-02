import { Component, OnInit } from '@angular/core';
import { AccessibilityService } from './services/accessibility.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private accessibilityService: AccessibilityService) {}

  ngOnInit(): void {
    this.accessibilityService.initializeFromStorage();
  }
}
