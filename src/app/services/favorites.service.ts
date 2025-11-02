import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from './simpsons.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly storageKey = 'simpsonsFavorites';
  private readonly favoritesSubject = new BehaviorSubject<Character[]>(this.loadInitialFavorites());

  readonly favorites$ = this.favoritesSubject.asObservable();

  private loadInitialFavorites(): Character[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    const storedFavorites = localStorage.getItem(this.storageKey);
    if (!storedFavorites) {
      return [];
    }

    try {
      const parsed: Character[] = JSON.parse(storedFavorites);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('No se pudieron cargar los favoritos guardados.', error);
      return [];
    }
  }

  private persistFavorites(favorites: Character[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(favorites));
    } catch (error) {
      console.warn('No se pudieron guardar los favoritos.', error);
    }
  }

  toggleFavorite(character: Character): void {
    const favorites = [...this.favoritesSubject.value];
    const exists = favorites.find((fav) => fav.id === character.id);

    if (exists) {
      const filtered = favorites.filter((fav) => fav.id !== character.id);
      this.favoritesSubject.next(filtered);
      this.persistFavorites(filtered);
      return;
    }

    const updatedFavorites = [...favorites, character];
    this.favoritesSubject.next(updatedFavorites);
    this.persistFavorites(updatedFavorites);
  }

  removeFavorite(id: number): void {
    const filtered = this.favoritesSubject.value.filter((favorite) => favorite.id !== id);
    this.favoritesSubject.next(filtered);
    this.persistFavorites(filtered);
  }

  isFavorite(id: number): boolean {
    return this.favoritesSubject.value.some((favorite) => favorite.id === id);
  }
}
