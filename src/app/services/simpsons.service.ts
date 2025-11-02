import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Character {
  id: number;
  age: number | null;
  birthdate: string | null;
  gender: string;
  name: string;
  occupation: string;
  portrait_path: string;
  phrases: string[];
  status: string;
}

export interface ApiResponse {
  count: number;
  next: string | null;
  prev: string | null;
  pages: number;
  results: Character[];
}

export interface Episode {
  id: number;
  airdate: string | null;
  episode_number: number;
  image_path: string;
  name: string;
  season: number;
  synopsis: string;
}

export interface ApiResponseEpisodes {
  count: number;
  next: string | null;
  prev: string | null;
  pages: number;
  results: Episode[];
}

@Injectable({
  providedIn: 'root'
})
export class SimpsonsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCharacters(page: number = 1, limit: number = 20): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/characters?page=${page}&limit=${limit}`);
  }

  getCharacterById(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/characters/${id}`);
  }

  searchCharacters(name: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/characters?name=${name}`);
  }

  getEpisodes(page: number = 1, limit: number = 20): Observable<ApiResponseEpisodes> {
    return this.http.get<ApiResponseEpisodes>(`${this.apiUrl}/episodes?page=${page}&limit=${limit}`);
  }
  
}