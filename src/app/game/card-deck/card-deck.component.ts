import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { Card } from "../../common/card.model";
import { GameService } from "src/app/common/game.service";
import { BooleanObject } from "src/app/common/booleanObject.model";
@Component({
  selector: "app-card-deck",
  templateUrl: "./card-deck.component.html",
  styleUrls: ["./card-deck.component.css"],
})
export class CardDeckComponent implements OnInit {
  //Initialisation des variables

  stopTimer: boolean = false;
  timer: string;
  hand: string;
  @Output() lancementTimer: EventEmitter<string> = new EventEmitter();
  playingCard: Card;
  firstCard: Card;
  public hasGameStarted: BooleanObject;
  public cardDeck: Card[] = [];

  // INJECTION DES SERVICES

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.cardDeck = this.gameService.getMovies();
    this.hasGameStarted = this.gameService.hasGameStarted;
  }

  resetPioche() {
    this.hasGameStarted.value = false;
  }

  pickFirstCard() {
    this.gameService.pickFirstCard();
  }

  // > on lance le timer
  @Output() startTimerEmitter: EventEmitter<any> = new EventEmitter();
  startTimer() {
    this.lancementTimer.emit(this.timer);
  }

  //AU DEUXIEME CLIC et ensuite
  // > on affiche le titre de playingCard
  @Output() showHandCardEmitter: EventEmitter<boolean> = new EventEmitter();
  // > on envoie les cartes tirées de la pioche vers la main du joueur
  @Output() playingCardEmitter: EventEmitter<Card> = new EventEmitter();
  sendingplayingCard() {
    this.playingCardEmitter.emit(this.playingCard);
  }

  pickPlayingCard() {
    if (!this.stopTimer) {
      let randomIndex = Math.floor(Math.random() * this.cardDeck.length);
      this.playingCard = this.cardDeck[randomIndex];
      this.cardDeck.splice(randomIndex, 1);
      this.sendingplayingCard();
      this.showHandCardEmitter.emit(true);
      if (this.cardDeck.length === 0) {
        this.gameService.getMovies();
      }
    }
  }

}
