import { Component, OnInit, inject } from '@angular/core';
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
  private readonly simpsonsService = inject(SimpsonsService);
  private readonly favoritesService = inject(FavoritesService);

  private readonly knownCharactersStorageKey = 'simpsons_known_character_ids';
  private readonly recentCharactersStorageKey = 'simpsons_recent_character_ids';
  private readonly recentCharacterTtlMs = 1000 * 60 * 60 * 24 * 7; // 7 days

  characters: CharacterWithMeta[] = [];
  loading: boolean = false;
  page: number = 1;
  private readonly phraseIndexes = new Map<number, number>();
  private knownCharacterIds = new Set<number>();
  private recentCharacterMap = new Map<number, number>();

  ngOnInit() {
    this.initializeCharacterTracking();
    this.loadCharacters();
  }

  loadCharacters(event?: any) {
    this.loading = true;
    this.simpsonsService.getCharacters(this.page, 20).subscribe({
      next: (response) => {
        this.cleanUpExpiredRecentCharacters();
        const enrichedCharacters = response.results.map((character) =>
          this.enrichCharacter(character)
        );
        this.characters = [...this.characters, ...enrichedCharacters];
        this.persistCharacterTracking();
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
    this.phraseIndexes.clear();
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

  getCurrentPhrase(character: CharacterWithMeta): string | null {
    const phrases = character.phrases ?? [];
    if (!phrases.length) {
      return null;
    }

    const index = this.phraseIndexes.get(character.id) ?? 0;
    return phrases[index] ?? null;
  }

  showNextPhrase(character: CharacterWithMeta, event?: Event): void {
    event?.stopPropagation();
    const phrases = character.phrases ?? [];
    if (phrases.length <= 1) {
      return;
    }

    const currentIndex = this.phraseIndexes.get(character.id) ?? 0;
    const nextIndex = (currentIndex + 1) % phrases.length;
    this.phraseIndexes.set(character.id, nextIndex);
  }

  private initializeCharacterTracking(): void {
    this.knownCharacterIds = this.loadKnownCharacterIds();
    this.recentCharacterMap = this.loadRecentCharacterMap();
  }

  private enrichCharacter(character: Character): CharacterWithMeta {
    const now = Date.now();
    const wasKnown = this.knownCharacterIds.has(character.id);
    let isNew = false;

    if (!wasKnown) {
      isNew = true;
      this.knownCharacterIds.add(character.id);
      this.recentCharacterMap.set(character.id, now);
    } else if (this.isCharacterRecent(character.id)) {
      isNew = true;
    }

    if (!this.phraseIndexes.has(character.id)) {
      this.phraseIndexes.set(character.id, 0);
    }

    return { ...character, isNew };
  }

  private loadKnownCharacterIds(): Set<number> {
    if (!this.isStorageAvailable()) {
      return new Set<number>();
    }

    try {
      const rawValue = localStorage.getItem(this.knownCharactersStorageKey);
      if (!rawValue) {
        return new Set<number>();
      }

      const parsed: unknown = JSON.parse(rawValue);
      if (Array.isArray(parsed)) {
        const ids = parsed
          .map((id) => Number(id))
          .filter((id) => Number.isFinite(id));
        return new Set<number>(ids);
      }
    } catch (error) {
      console.warn('No fue posible recuperar los personajes conocidos.', error);
    }

    return new Set<number>();
  }

  private loadRecentCharacterMap(): Map<number, number> {
    const map = new Map<number, number>();

    if (!this.isStorageAvailable()) {
      return map;
    }

    try {
      const rawValue = localStorage.getItem(this.recentCharactersStorageKey);
      if (!rawValue) {
        return map;
      }

      const parsed: unknown = JSON.parse(rawValue);
      if (parsed && typeof parsed === 'object') {
        const entries = Object.entries(parsed as Record<string, unknown>);
        for (const [id, timestamp] of entries) {
          const numericId = Number(id);
          const numericTimestamp = Number(timestamp);

          if (
            Number.isFinite(numericId) &&
            Number.isFinite(numericTimestamp) &&
            Date.now() - numericTimestamp <= this.recentCharacterTtlMs
          ) {
            map.set(numericId, numericTimestamp);
          }
        }
      }
    } catch (error) {
      console.warn('No fue posible recuperar los personajes recientes.', error);
    }

    return map;
  }

  private cleanUpExpiredRecentCharacters(): void {
    const now = Date.now();
    for (const [id, timestamp] of this.recentCharacterMap.entries()) {
      if (now - timestamp > this.recentCharacterTtlMs) {
        this.recentCharacterMap.delete(id);
      }
    }
  }

  private isCharacterRecent(characterId: number): boolean {
    const timestamp = this.recentCharacterMap.get(characterId);
    if (!timestamp) {
      return false;
    }

    if (Date.now() - timestamp > this.recentCharacterTtlMs) {
      this.recentCharacterMap.delete(characterId);
      return false;
    }

    return true;
  }

  private persistCharacterTracking(): void {
    if (!this.isStorageAvailable()) {
      return;
    }

    try {
      const knownIdsArray = Array.from(this.knownCharacterIds);
      const recentEntries = Object.fromEntries(this.recentCharacterMap);

      localStorage.setItem(
        this.knownCharactersStorageKey,
        JSON.stringify(knownIdsArray)
      );
      localStorage.setItem(
        this.recentCharactersStorageKey,
        JSON.stringify(recentEntries)
      );
    } catch (error) {
      console.warn('No fue posible guardar el estado de los personajes.', error);
    }
  }

  private isStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}

type CharacterWithMeta = Character & {
  isNew?: boolean;
};
