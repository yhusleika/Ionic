import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDark = false;

  constructor() {
    // Detect system preference on load
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDark = prefersDark.matches;
    this.applyTheme();
  }

  toggle() {
    this.isDark = !this.isDark;
    this.applyTheme();
  }

  isDarkMode() {
    return this.isDark;
  }

  private applyTheme() {
    document.documentElement.classList.toggle('ion-palette-dark', this.isDark);
  }
}
