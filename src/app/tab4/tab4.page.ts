import { Component, OnInit, ViewChild } from '@angular/core';
import { SimpsonsService, Episode } from '../services/simpsons.service';
import { environment } from '../../environments/environment';
import { IonInfiniteScroll } from '@ionic/angular';

interface SeasonGroup {
  season: number;
  episodes: Episode[];
}

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: false,
})
export class Tab4Page implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  allEpisodes: Episode[] = [];
  groupedEpisodes: SeasonGroup[] = []; // Lista maestra de episodios agrupados
  filteredGroups: SeasonGroup[] = []; // Lista filtrada para mostrar en la vista
  loading: boolean = false;
  page: number = 1;
  totalPages: number = 1;
  searchTerm: string = '';

  constructor(private simpsonsService: SimpsonsService) {}

  ngOnInit() {
    this.loadEpisodes();
  }

  loadEpisodes(event?: any) {
    if (this.page === 1) {
      this.loading = true;
    }

    this.simpsonsService.getEpisodes(this.page, 20).subscribe({
      next: (response) => {
        this.allEpisodes = [...this.allEpisodes, ...response.results];
        this.totalPages = response.pages;
        this.groupEpisodes(); // Agrupará y aplicará el filtro

        this.loading = false;
        if (event) {
          event.target.complete();
        }
        
        if (this.page >= this.totalPages) {
          if (this.infiniteScroll) {
            this.infiniteScroll.disabled = true;
          }
        }
      },
      error: (error) => {
        console.error('Error loading episodes:', error);
        this.loading = false;
        if (event) {
          event.target.complete();
        }
      }
    });
  }

  groupEpisodes() {
    const groups = new Map<number, Episode[]>();

    for (const episode of this.allEpisodes) {
      if (!groups.has(episode.season)) {
        groups.set(episode.season, []);
      }
      groups.get(episode.season)!.push(episode);
    }

    this.groupedEpisodes = Array.from(groups.keys())
      .sort((a, b) => a - b) 
      .map(season => ({
        season,
        episodes: groups.get(season)!.sort((a,b) => a.episode_number - b.episode_number)
      }));
    
    // Aplicar el filtro actual (o mostrar todo si no hay filtro)
    this.applyFilter();
  }

  /**
   * Se llama cada vez que el usuario escribe en la barra de búsqueda
   */
  handleSearch(event: any) {
    this.searchTerm = event.target.value;
    this.applyFilter();
  }

  /**
   * Filtra la lista 'groupedEpisodes' y asigna el resultado a 'filteredGroups'
   */
  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      // Si no hay término de búsqueda, mostrar todos los episodios
      this.filteredGroups = [...this.groupedEpisodes];
      return;
    }

    // Aplicar filtro
    this.filteredGroups = this.groupedEpisodes
      .map(group => {
        // Filtramos los episodios de este grupo
        const filteredEpisodes = group.episodes.filter(episode =>
          episode.name.toLowerCase().includes(term) ||
          episode.synopsis.toLowerCase().includes(term)
        );
        
        // Devolvemos un *nuevo* objeto de grupo con solo los episodios filtrados
        return {
          ...group,
          episodes: filteredEpisodes
        };
      })
      // Excluir temporadas que se quedaron sin episodios después del filtro
      .filter(group => group.episodes.length > 0);
  }


  loadMore(event: any) {
    this.page++;
    this.loadEpisodes(event);
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath || imagePath.length < 5) {
      return 'assets/icon/favicon.png';
    }
    return environment.episodeImageUrl + imagePath;
  }
}