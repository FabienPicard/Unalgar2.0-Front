import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private http: HttpClient) { }

  private baseUrl : string = environment.host_back;
  private pokemonEndPoint : string = environment.pokemon_endPoint;
  private getPokemonCard : string = environment.getPokemonCard;

  public getPokemons(): Observable<any>{
    return this.http.get(this.baseUrl+this.pokemonEndPoint + this.getPokemonCard)
  }

}
