import { Component, OnInit } from '@angular/core';
import { SimpsonsService, Character } from '../services/simpsons.service';
import { FavoritesService } from '../services/favorites.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  characters: Character[] = [];
  loading: boolean = false;
  page: number = 1;

  constructor(
    private simpsonsService: SimpsonsService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    this.loadCharacters();
  }

  loadCharacters(event?: any) {
    this.loading = true;
    this.simpsonsService.getCharacters(this.page, 20).subscribe({
      next: (response) => {
        this.characters = [...this.characters, ...response.results];
        this.loading = false;
        if (event) {
          event.target.complete();
        }
      },
      error: (error) => {
        console.error('Error loading characters:', error);
        this.loading = false;
        if (event) {
          event.target.complete();
        }
      }
    });
  }

  loadMore(event: any) {
    this.page++;
    this.loadCharacters(event);
  }

  doRefresh(event: any) {
    this.characters = [];
    this.page = 1;
    this.loadCharacters(event);
  }

  getImageUrl(portraitPath: string): string {
    return environment.imageBaseUrl + portraitPath;
  }

  toggleFavorite(character: Character): void {
    this.favoritesService.toggleFavorite(character);
  }

  isFavorite(character: Character): boolean {
    return this.favoritesService.isFavorite(character.id);
  }
}
