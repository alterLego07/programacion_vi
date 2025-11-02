import { Component, OnInit, Renderer2, inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private readonly storageKey = 'tp-simpsons-theme';
  private readonly renderer = inject(Renderer2);

  isDarkMode = false;

  ngOnInit() {
    if (!this.isBrowser()) {
      return;
    }

    const storedTheme = localStorage.getItem(this.storageKey) as 'light' | 'dark' | null;

    if (storedTheme) {
      this.applyTheme(storedTheme === 'dark');
      return;
    }

    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyTheme(prefersDark);
  }

  toggleTheme() {
    this.applyTheme(!this.isDarkMode);
  }

  get themeLabel(): string {
    return this.isDarkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';
  }

  private applyTheme(enableDark: boolean) {
    if (!this.isBrowser()) {
      this.isDarkMode = enableDark;
      return;
    }

    this.isDarkMode = enableDark;

    const body = document.body;

    if (enableDark) {
      this.renderer.addClass(body, 'dark-theme');
      localStorage.setItem(this.storageKey, 'dark');
    } else {
      this.renderer.removeClass(body, 'dark-theme');
      localStorage.setItem(this.storageKey, 'light');
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }
}
