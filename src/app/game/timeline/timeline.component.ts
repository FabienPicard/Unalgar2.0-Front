import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { GameService } from "src/app/common/services/game.service";
import { Message } from "src/app/common/models/message.model";
import { MessageService } from "src/app/common/services/message.service";
import { Status } from "src/app/common/models/status.model";
import { Timer } from "src/app/common/models/timer.model";
import { Card } from "../../common/models/card.model";

@Component({
  selector: "app-timeline",
  templateUrl: "./timeline.component.html",
  styleUrls: ["./timeline.component.css"],
})
export class TimelineComponent implements OnInit {
  //Initialisation des propriétés

  public timelineDeck: Card[] = [];
  public displayMessage: boolean = false;
  public cardDeck: Card[] = [];
  public timerObject: Timer;
  public isDateRight: Status;
  stopTimer: boolean = false;
  scoreTotal: number;
  displayScoreTotal: boolean = false;

  @Input() playingCard: Card;
  @Output() rightClick: EventEmitter<any> = new EventEmitter();

  // > on envoie les cartes tirées de la pioche vers la main du joueur
  @Output() playingCardEmitter: EventEmitter<Card> = new EventEmitter();
  sendingplayingCard() {
    this.playingCardEmitter.emit(this.playingCard);
  }

  // INJECTION DES SERVICES

  constructor(
    private gameService: GameService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.timelineDeck = this.gameService.getTimelineDeck();
    this.cardDeck = this.gameService.getCardDeck();
    this.timerObject = this.gameService.timerObject;
    this.isDateRight = this.gameService.isDateRight;
  }

  //La carte est ajoutée sur la droite
  addToTimelineRightSide(card: Card) {
    if (!this.stopTimer) {
      // On va chercher l'indice de la carte à gauche de l'emplacement choisi
      let leftCardIndex: number = this.timelineDeck.indexOf(card);
      //On définit ce que sera l'indice de playingCard dans la timeline
      let playingCardIndex: number = leftCardIndex + 1;
      this.timelineDeck.splice(playingCardIndex, 0, this.playingCard);
      this.checkCardPosition(this.playingCard);
      setTimeout(() => {
        this.pickPlayingCard()
      }, 100);
    }
  }

  //La carte est ajoutée sur la gauche
  addToTimelineLeftSide(card: Card) {
    if (!this.stopTimer) {
      // On va chercher l'indice de la carte à droite de l'emplacement choisi
      let rightCardIndex: number = this.timelineDeck.indexOf(card);
      //On définit ce que sera l'indice de playingCard dans la timeline
      let playingCardIndex: number = rightCardIndex;
      this.timelineDeck.splice(playingCardIndex, 0, this.playingCard);
      this.checkCardPosition(this.playingCard);
      setTimeout(() => {
        this.pickPlayingCard()
      }, 100);
    }
  }

  checkCardPosition(playingCard: Card) {
    //capte l'index actuel de la carte
    let playingCardIndex: number = this.timelineDeck.indexOf(playingCard);
    //Cherche la carte qui est avant (leftCard) et la carte qui est après (rightCard) notre playingCard dans la timeline
    let leftCard: Card = this.timelineDeck[playingCardIndex - 1];
    let rightCard: Card = this.timelineDeck[playingCardIndex + 1];

    //CAS 1 : la carte est posée au tout début de la timeline
    if (playingCardIndex === 0) {
      if (parseInt(playingCard.date) <= parseInt(rightCard.date)) {
        this.isDateRight.value = true;
      } else {
        this.isDateRight.value = false;
        this.timelineDeck.splice(playingCardIndex, 1);
        //on rajoute 2 secondes de pénalité
        this.gameService.addPenalty();
      }
      //CAS 2 : la carte est posée à la toute fin de la timeline
    } else if (playingCardIndex === this.timelineDeck.length - 1) {
      if (parseInt(playingCard.date) >= parseInt(leftCard.date)) {
        this.isDateRight.value = true;
      } else {
        this.isDateRight.value = false;
        this.timelineDeck.splice(playingCardIndex, 1);
        //on rajoute 2 secondes de pénalité
        this.gameService.addPenalty();
      }
      //CAS 3 : la carte est posée entre 2 cartes
    } else {
      if (
        parseInt(playingCard.date) >= parseInt(leftCard.date) &&
        parseInt(playingCard.date) <= parseInt(rightCard.date)
      ) {
        this.isDateRight.value = true;
      } else {
        this.isDateRight.value = false;
        this.timelineDeck.splice(playingCardIndex, 1);
        //on rajoute 2 secondes de pénalité
        this.gameService.addPenalty();
      }
    }

    this.messageService.addMessage(
      new Message(this.isDateRight.value, playingCard.date)
    );
  }

  recievedStopTimer() {
    this.stopTimer = true;
  }

  // Pioche une carte aléatoire, l'enlève du deck, la met dans la main du joueur
  pickPlayingCard() {
    if (!this.stopTimer) {
      this.cardDeck = this.gameService.cardDeck
      let randomIndex = Math.floor(Math.random() * this.cardDeck.length);
      this.playingCard = this.cardDeck[randomIndex];
      this.cardDeck.splice(randomIndex, 1);
      this.sendingplayingCard();
      //si le deck est vide, charge de nouveaux films via l'API
      if (this.cardDeck.length === 0) {
        this.gameService.getMovies();
      }
    }
  }

}
