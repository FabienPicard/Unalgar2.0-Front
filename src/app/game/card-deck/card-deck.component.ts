import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { MoviesService } from "src/app/common/movies.service";
import { Card } from "../../common/card.model";
import { GameService } from "src/app/common/game.service";
import { Movie } from "src/app/common/movie.model";

@Component({
  selector: "app-card-deck",
  templateUrl: "./card-deck.component.html",
  styleUrls: ["./card-deck.component.css"],
})
export class CardDeckComponent implements OnInit {
  //Initialisation des variables

  timer: string;
  hand: string;
  @Output() lancementTimer: EventEmitter<string> = new EventEmitter();
  playingCard: Card;
  firstCard: Card;
  @Output() hasGameStarted: boolean = false;
  public cardDeck: Card[] = [];

  // INJECTION DES SERVICES

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.cardDeck = this.gameService.getMovies();
  }

  //Envoie la 1ère carte du jeu
  @Output() firstCardEmitter: EventEmitter<Card> = new EventEmitter();

  @Output() startTimerEmitter: EventEmitter<any> = new EventEmitter();

  @Output() showHandCardEmitter: EventEmitter<boolean> = new EventEmitter();
  sendingfirstCard() {
    this.firstCardEmitter.emit(this.firstCard);
  }

  //Envoie la carte en cours
  @Output() playingCardEmitter: EventEmitter<Card> = new EventEmitter();

  sendingplayingCard() {
    this.playingCardEmitter.emit(this.playingCard);
  }

  pickFirstCard() {
    let randomIndex = Math.floor(Math.random() * this.cardDeck.length);
    this.firstCard = this.cardDeck[randomIndex];
    this.cardDeck.splice(randomIndex, 1);
    this.gameService.addCardToTimeline(this.firstCard);
    this.hasGameStarted = true;
    this.startTimerEmitter.emit(null);
  }

  pickPlayingCard() {
    let randomIndex = Math.floor(Math.random() * this.cardDeck.length);
    this.playingCard = this.cardDeck[randomIndex];
    this.cardDeck.splice(randomIndex, 1);
    this.sendingplayingCard();
    this.showHandCardEmitter.emit(true);
  }

  startTimer() {
    this.lancementTimer.emit(this.timer);
  }
}
