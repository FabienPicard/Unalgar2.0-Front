import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { Card } from "../../common/models/card.model";
import { GameService } from "src/app/common/services/game.service";
import { Status } from "src/app/common/models/status.model";
import Swal from "sweetalert2";
@Component({
  selector: "app-card-deck",
  templateUrl: "./card-deck.component.html",
  styleUrls: ["./card-deck.component.css"],
})
export class CardDeckComponent implements OnInit {
  //Initialisation des variables
  timer: string;
  hand: string;
  playingCard: Card;
  firstCard: Card;
  public hasGameStarted: Status;
  public cardDeck: Card[] = [];

  // INJECTION DES SERVICES

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.choixCard()
    this.hasGameStarted = this.gameService.hasGameStarted;
  }

  pickFirstCard() {
   this.cardDeck = this.gameService.pickFirstCard();
    this.pickPlayingCard();
  }

  // > on affiche le titre de playingCard
  @Output() showHandCardEmitter: EventEmitter<boolean> = new EventEmitter();

  // > on envoie les cartes tirées de la pioche vers la main du joueur
  @Output() playingCardEmitter: EventEmitter<Card> = new EventEmitter();
  sendingplayingCard() {
    this.playingCardEmitter.emit(this.playingCard);
  }

  //Pioche une carte random, l'enlève du deck, l'envoie dans la main joueur
  pickPlayingCard() {
    let randomIndex = Math.floor(Math.random() * this.cardDeck.length);
    this.playingCard = this.cardDeck[randomIndex];
    this.cardDeck.splice(randomIndex, 1);
    this.sendingplayingCard();
    this.showHandCardEmitter.emit(true);
    //si le deck est vide, va chercher des nouveaux films via l'API
    if (this.cardDeck.length === 0) {
      this.gameService.getMovies();
    }
  }

  choixCard(): void {
    this.gameService.choixCard()
  }

}
