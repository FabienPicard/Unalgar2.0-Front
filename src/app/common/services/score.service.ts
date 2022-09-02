import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Score } from '../models/score.model';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  private baseUrl : string = environment.host_back;
  private scoreEndPoint : string = environment.score_endPoint;
  private addScoreEndPoint : string = environment.addScore;
  private getTopScoreEndPoint : string = environment.getTopScore

  constructor(private http:HttpClient) { }

  public addScore(score : Score):Observable<any>{
    return this.http.post(this.baseUrl + this.scoreEndPoint + this.addScoreEndPoint,
      {score})
  }

  public getTopScore(cardType : string): Observable<any>{
    return this.http.post(this.baseUrl + this.scoreEndPoint + this.getTopScoreEndPoint, {cardType})
  }

}
