// MoviesService sert à aller récupérer les données de l'API Movie DATABASE

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MoviesService {
  private baseUrl: string = environment.host_back;
  private moviesEndPoint : string = environment.movie_endPoint;
  private getCardMoviesEndPoint : string = environment.getCardMoviesEndPoint;

  constructor(private http: HttpClient) {}
  // On commence les requêtes à la page 1 pour éviter certains films
  private pageCounter: number = 0;

  //On requête l'API pour obtenir les films
  public getMovies(): Observable<any> {
    this.pageCounter++;
   return this.http.get(this.baseUrl + this.moviesEndPoint + this.getCardMoviesEndPoint + this.pageCounter)
  }
}