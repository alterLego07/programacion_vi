import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FavoritesService } from '../services/favorites.service';
import { Character } from '../services/simpsons.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  private readonly favoritesService = inject(FavoritesService);

  readonly favorites$: Observable<Character[]> = this.favoritesService.favorites$;

  getImageUrl(portraitPath: string): string {
    return environment.imageBaseUrl + portraitPath;
  }

  removeFavorite(character: Character): void {
    this.favoritesService.removeFavorite(character.id);
  }

  trackByCharacter(_: number, character: Character): number {
    return character.id;
  }
}
