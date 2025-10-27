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
  groupedEpisodes: SeasonGroup[] = [];
  loading: boolean = false;
  page: number = 1;
  totalPages: number = 1;

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
        this.groupEpisodes();

        this.loading = false;
        if (event) {
          event.target.complete();
        }
        
        // Deshabilitar scroll infinito si llegamos al final
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
      .sort((a, b) => a - b) // Ordenar por temporada
      .map(season => ({
        season,
        episodes: groups.get(season)!.sort((a,b) => a.episode_number - b.episode_number) // Ordenar episodios
      }));
  }

  loadMore(event: any) {
    this.page++;
    this.loadEpisodes(event);
  }

  getImageUrl(imagePath: string): string {
    // La API a veces devuelve null o un path incorrecto
    if (!imagePath || imagePath.length < 5) {
      // Devuelve un placeholder. Ya tienes favicon.png en assets.
      return 'assets/icon/favicon.png';
    }
    return environment.episodeImageUrl + imagePath;
  }
}