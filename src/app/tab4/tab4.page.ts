import { Component, OnInit } from '@angular/core'; // Se elimina ViewChild e IonInfiniteScroll
import { SimpsonsService, Episode } from '../services/simpsons.service';
import { environment } from '../../environments/environment';

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
  // Se elimina @ViewChild(IonInfiniteScroll) y la propiedad infiniteScroll

  allEpisodes: Episode[] = [];
  groupedEpisodes: SeasonGroup[] = [];
  filteredGroups: SeasonGroup[] = [];
  loading: boolean = false;
  page: number = 1;
  totalPages: number = 1;
  searchTerm: string = '';

  constructor(private simpsonsService: SimpsonsService) {}

  ngOnInit() {
    this.loadEpisodes(); // Inicia la carga de todas las páginas
  }

  loadEpisodes() { // Se elimina el parámetro 'event'
    if (this.page === 1) {
      this.loading = true; // Mostrar spinner solo al inicio
    }

    this.simpsonsService.getEpisodes(this.page, 20).subscribe({
      next: (response) => {
        this.allEpisodes = [...this.allEpisodes, ...response.results];
        this.totalPages = response.pages;
        this.groupEpisodes(); // Agrupa y filtra en cada página cargada

        // Lógica de carga recursiva
        if (this.page < this.totalPages) {
          // Si hay más páginas, carga la siguiente
          this.page++;
          this.loadEpisodes();
        } else {
          // Se cargaron todas las páginas, ocultamos el spinner
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading episodes:', error);
        this.loading = false; // Detener carga en caso de error
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

    this.applyFilter();
  }

  handleSearch(event: any) {
    this.searchTerm = event.target.value;
    this.applyFilter();
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredGroups = [...this.groupedEpisodes];
      return;
    }

    this.filteredGroups = this.groupedEpisodes
      .map(group => {
        const filteredEpisodes = group.episodes.filter(episode =>
          episode.name.toLowerCase().includes(term) ||
          episode.synopsis.toLowerCase().includes(term)
        );

        return {
          ...group,
          episodes: filteredEpisodes
        };
      })
      .filter(group => group.episodes.length > 0);
  }

  // Se elimina la función loadMore(event: any)

  getImageUrl(imagePath: string): string {
    if (!imagePath || imagePath.length < 5) {
      return 'assets/icon/favicon.png';
    }
    return environment.episodeImageUrl + imagePath;
  }
}