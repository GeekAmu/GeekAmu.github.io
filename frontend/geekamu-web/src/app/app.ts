import { Component, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private doc = inject(DOCUMENT);

  protected theme = signal<'dark' | 'light'>(
    (localStorage.getItem('geekamu-theme') as 'dark' | 'light') ?? 'dark'
  );

  constructor() {
    this.applyTheme(this.theme());

    effect(() => {
      const t = this.theme();
      this.applyTheme(t);
      localStorage.setItem('geekamu-theme', t);
    });
  }

  protected toggleTheme(): void {
    this.theme.update(t => (t === 'dark' ? 'light' : 'dark'));
  }

  private applyTheme(theme: 'dark' | 'light'): void {
    this.doc.documentElement.classList.toggle('light', theme === 'light');
  }
}
