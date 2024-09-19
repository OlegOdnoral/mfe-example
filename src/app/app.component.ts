import { Component, DestroyRef, ElementRef, inject, Input, OnInit } from '@angular/core';
import { NavigationEnd, NavigationSkipped, NavigationStart, Router, RouterLink, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { filter, tap } from "rxjs";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { JsonPipe } from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, TranslateModule, RouterLink, JsonPipe ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'mfe-example';

  contextconfiguration!: unknown;

  readonly #router = inject(Router);
  readonly #destroyRef = inject(DestroyRef);
  readonly #translate = inject(TranslateService);
  readonly #elementRef = inject(ElementRef);

  readonly #defaultLang = 'en'
  readonly #langQueryName: string = "shell-lang";

  ngOnInit(): void {
    this.contextconfiguration = JSON.parse(this.#elementRef.nativeElement.getAttribute('contextconfiguration'))
    this.#trackLocale();
  }

  #trackLocale(): void {
    this.#router.events
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        filter((event) => event instanceof NavigationEnd || event instanceof NavigationSkipped),
      )
      .subscribe(() => this.#translate.use(this.#getCurrentLocaleFromUrl || this.#defaultLang));
  }

  get #getCurrentLocaleFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(this.#langQueryName);
  }
}
