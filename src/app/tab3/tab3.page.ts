import { Component, OnDestroy, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { FavoritesService } from '../services/favorites.service';
import { ApiResponseLocations, Character, Location, SimpsonsService } from '../services/simpsons.service';
import { environment } from '../../environments/environment';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
  animations: [
    trigger('favoriteCardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px) scale(0.96)' }),
        animate('350ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('250ms cubic-bezier(0.55, 0, 0.1, 1)', style({ opacity: 0, transform: 'translateY(-10px) scale(0.94)' }))
      ])
    ]),
    trigger('locationCardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.92) translateY(10px)' }),
        animate('320ms 80ms cubic-bezier(0.17, 0.67, 0.3, 1.3)', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ])
    ])
  ],
})
export class Tab3Page implements OnDestroy {
  private readonly favoritesService = inject(FavoritesService);
  private readonly simpsonsService = inject(SimpsonsService);
  private readonly document = inject(DOCUMENT);

  readonly favoritesWithQuotes$: Observable<FavoriteWithQuote[]> = this.favoritesService.favorites$.pipe(
    map((favorites) =>
      favorites.map((character) => ({
        character,
        quote: this.pickRandomQuote(character.phrases)
      }))
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly locations$: Observable<Location[]> = this.simpsonsService.getLocations().pipe(
    map((response) => {
      if (Array.isArray(response)) {
        return response;
      }

      return (response as ApiResponseLocations).results ?? [];
    }),
    catchError(() => of([] as Location[])),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  nightThemeEnabled = false;
  private readonly nightThemeClass = 'theme-springfield-night';

  getImageUrl(portraitPath: string): string {
    return environment.imageBaseUrl + portraitPath;
  }

  getLocationImageUrl(imagePath: string): string {
    return environment.imageBaseUrl + imagePath;
  }

  removeFavorite(character: Character): void {
    this.favoritesService.removeFavorite(character.id);
  }

  trackByFavorite(_: number, favorite: FavoriteWithQuote): number {
    return favorite.character.id;
  }

  trackByLocation(_: number, location: Location): number {
    return location.id;
  }

  switchNightTheme(): void {
    this.nightThemeEnabled = !this.nightThemeEnabled;
    this.updateNightTheme();
  }

  ngOnDestroy(): void {
    this.document.body.classList.remove(this.nightThemeClass);
  }

  private pickRandomQuote(phrases: string[] | null | undefined): string | null {
    if (!phrases || phrases.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * phrases.length);
    return phrases[randomIndex];
  }

  private updateNightTheme(): void {
    const body = this.document.body;
    body.classList.toggle(this.nightThemeClass, this.nightThemeEnabled);
  }
}

interface FavoriteWithQuote {
  character: Character;
  quote: string | null;
}
