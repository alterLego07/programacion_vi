import { Component } from '@angular/core';
import { SimpsonsService, Character } from '../services/simpsons.service';
import { environment } from '../../environments/environments';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  searchTerm: string = '';
  characters: Character[] = [];
  loading: boolean = false;
  searched: boolean = false;
  private searchSubject = new Subject<string>();

  constructor(private simpsonsService: SimpsonsService) {
    // Configurar debounce para la búsqueda
    this.searchSubject.pipe(
      debounceTime(500), // Esperar 500ms después de que el usuario deje de escribir
      distinctUntilChanged() // Solo buscar si el término cambió
    ).subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  }

  onSearchChange(event: any) {
    const searchTerm = event.target.value;
    this.searchTerm = searchTerm;

    if (searchTerm.trim() === '') {
      this.clearSearch();
      return;
    }

    this.searchSubject.next(searchTerm);
  }

  performSearch(searchTerm: string) {
    if (searchTerm.trim() === '') {
      return;
    }

    this.loading = true;
    this.searched = true;
    this.simpsonsService.searchCharacters(searchTerm.trim()).subscribe({
      next: (response) => {
        this.characters = response.results;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching characters:', error);
        this.loading = false;
        this.characters = [];
      }
    });
  }

  clearSearch() {
    this.searchTerm = '';
    this.characters = [];
    this.searched = false;
  }

  getImageUrl(portraitPath: string): string {
    return environment.imageBaseUrl + portraitPath;
  }
}
