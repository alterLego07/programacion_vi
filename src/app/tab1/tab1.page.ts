import { Component, OnInit } from '@angular/core';
import { SimpsonsService, Character } from '../services/simpsons.service';
import { environment } from '../../environments/environments';
import { ModalController } from '@ionic/angular';

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
  selectedCharacter: Character | null = null;
  isModalOpen: boolean = false;
  loadingDetails: boolean = false;

  constructor(
    private simpsonsService: SimpsonsService,
    private modalController: ModalController
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

  async openCharacterDetails(character: Character) {
    this.loadingDetails = true;
    this.isModalOpen = true;

    // Cargar los detalles 
    this.simpsonsService.getCharacterById(character.id).subscribe({
      next: (fullCharacter) => {
        this.selectedCharacter = fullCharacter;
        this.loadingDetails = false;
      },
      error: (error) => {
        console.error('Error loading character details:', error);
        this.selectedCharacter = character; 
        this.loadingDetails = false;
      }
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedCharacter = null;
  }

  getImageUrl(portraitPath: string): string {
    return environment.imageBaseUrl + portraitPath;
  }
}
