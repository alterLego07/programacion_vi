import { Component, inject } from '@angular/core';
import { SimpsonsService, Character } from '../services/simpsons.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  private readonly simpsonsService = inject(SimpsonsService);

  searchTerm: string = '';
  characters: Character[] = [];
  loading: boolean = false;
  searched: boolean = false;

  searchCharacters() {
    if (this.searchTerm.trim() === '') {
      return;
    }

    this.loading = true;
    this.searched = true;
    this.simpsonsService.searchCharacters(this.searchTerm).subscribe({
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
