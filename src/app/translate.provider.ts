import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { ModuleWithProviders } from '@angular/core';

/**
 * Creates a translation loader using the provided `HttpClient` and URL.
 * The loader fetches translation files from the specified URL.
 *
 * @param http - The `HttpClient` to use for fetching translation files.
 * @param url - The base URL where translation files are located.
 * @returns A `TranslateLoader` configured to load translation files from the specified URL.
 */

const createTranslateLoader = (http: HttpClient, url: string): TranslateLoader => {
  const translationUrl = `${url}/assets/i18n/`;
  return new TranslateHttpLoader(http, translationUrl, '.json');
};

/**
 * Custom handler for missing translations.
 * Logs a warning message to the console when a translation key is not found.
 */
export class MyMissingTranslationHandler implements MissingTranslationHandler {
  public handle(param: MissingTranslationHandlerParams): void {
    console.warn(`Can't find value for key=${param.key} and locale=${param.translateService.store.currentLang}`);
  }
}

/**
 * Provides translation configuration for the application.
 * Sets up the default language, missing translation handler, and translation loader.
 *
 * @param url - The base URL where translation files are located.
 * @returns A `ModuleWithProviders` for configuring the `TranslateModule`.
 */
export const provideTranslate = (url: string): ModuleWithProviders<TranslateModule> =>
  TranslateModule.forRoot({
    defaultLanguage: 'en',
    missingTranslationHandler: {
      provide: MissingTranslationHandler,
      useClass: MyMissingTranslationHandler,
    },
    loader: {
      provide: TranslateLoader,
      useFactory: (http: HttpClient) => createTranslateLoader(http, url),
      deps: [HttpClient],
    },
  });
