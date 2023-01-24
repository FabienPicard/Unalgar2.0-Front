import { Injectable } from "@angular/core";
import { CardDeckComponent } from "src/app/game/card-deck/card-deck.component";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { Card } from "../models/card.model";
import { Score } from "../models/score.model";
import { Status } from "../models/status.model";
import { Timer } from "../models/timer.model";
import { MoviesService } from "./movies.service";
import { PokemonService } from "./pokemon.service";
import { ScoreService } from "./score.service";

@Injectable({
  providedIn: "root",
})
export class GameService {
  // Propriété du jeu
  public cardDeck: Card[] = [];
  public timelineDeck: Card[] = [];
  public slicedMovieDate: string;
  public movieConverted: Card;
  public completeMovieImgUrl: string;
  public hasGameStarted: Status = new Status(false);
  public showHandCard: Status = new Status(false);
  public isDateRight: Status = new Status(false);
  public scoreTotal: number;
  public firstCard: Card;
  public moviesImg: string = environment.movie_imgUrl;
  public playingCard: Card;
  public cardType: string;
  public name: string;
  public score : Score = new Score("", 0, "");
  public topScores : Score[] = []

  // Propriétés du timer
  public temps: number = 60;
  public interval: any;
  public timerObject: Timer = new Timer(
    Math.floor(this.temps / 60),
    this.temps % 60,
    ""
  );

  //Injection du service gérant l'API
  constructor(
    private moviesService: MoviesService,
    private pokemonService: PokemonService,
    private scoreService: ScoreService
  ) {}

  public getTimelineDeck() {
    return this.timelineDeck;
  }
  public getCardDeck() {
    return this.cardDeck;
  }

  public getMovies(): Card[] {
    this.moviesService.getMovies().subscribe((response) => {
      this.cardDeck = response;
      for (let i = 0; i < this.cardDeck.length; i++) {
        this.cardDeck[i].img = this.moviesImg + this.cardDeck[i].img;
        this.cardDeck[i].date = this.cardDeck[i].date.slice(0, 4);
      }
    });
    return this.cardDeck;
  }

  public getPokemons(): Card[] {
    this.pokemonService.getPokemons().subscribe((response) => {
      this.cardDeck = response;
    });
    return this.cardDeck;
  }

  // Ajoute une carte dans la timeline
  public addCardToTimeline(card: Card) {
    this.timelineDeck.push(card);
  }

  // Tire une 1ère carte aléatoire et de l'ajouter à la timeline
  public pickFirstCard() {
    let randomIndex = Math.floor(Math.random() * this.cardDeck.length);
    this.firstCard = this.cardDeck[randomIndex];
    this.cardDeck.splice(randomIndex, 1);
    this.addCardToTimeline(this.firstCard);
    this.hasGameStarted.value = true;
    this.startTimer();
    return this.cardDeck;
  }

  // Lance le timer quand clic sur le bouton "commence à jouer"
  startTimer() {
    this.interval = setInterval(() => {
      this.timerObject.displayZero = "";
      if (
        (this.timerObject.minute === 0 && this.timerObject.second === 0) ||
        (this.timerObject.minute < 0 && this.timerObject.second != 0)
      ) {
        clearInterval(this.interval);
        this.timerObject.displayZero = "0";
        // Calcul du score
        this.scoreTotal = this.timelineDeck.length - 1;
        this.resetAllGame();
        this.showScoreTotal();
      } else if (
        this.timerObject.second === 0 &&
        this.timerObject.minute != 0
      ) {
        this.timerObject.minute--;
        this.timerObject.second = 59;
      } else if(this.timerObject.second > 0) {
        if (this.timerObject.second <= 10) {
          this.timerObject.displayZero = "0";
        }
        this.timerObject.second--;
      } 
    }, 1000);
  }

  // Display le score total à la fin du jeu
  showScoreTotal() {
    Swal.fire({
      icon: "success",
      title: "Partie terminée",
      heightAuto:false,
      text:
        "Bravo ! Tu as placé " + this.scoreTotal + " cartes sur la timeline",
      confirmButtonText: "Ok",
    }).then((result)=>{
      this.AddScore()
    })
  }

  // Display le choix des cartes
  choixCard(): void {
    Swal.fire({
      title: "Choix type de cartes : ",
      icon: "question",
      heightAuto:false,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Films",
      cancelButtonText: "Pokemons",
    }).then((result) => {
      if (result.isConfirmed) {
        this.cardType = "Movies"
        this.getMovies()
      } else{
        this.cardType = "Pokemons"
        this.getPokemons()
      }
        // on recup la liste
        this.cardDeck = this.getCardDeck();
        // on recup les top scores
        this.getTopScore(this.cardType)
    });
  }


  AddScore(): void{
    Swal.fire({
      title:"Save score ?",
      icon : "question",
      heightAuto:false,
      showCancelButton: true,
      confirmButtonText:"Oui",
      cancelButtonText:"Non",
    }).then((result)=>{
      if(result.isConfirmed){
        //Popup formulaire score
        Swal.fire({
          title:"Entrez votre nom",
          inputLabel:"name",
          input:"text",
          heightAuto:false,
          inputValue:this.name,
        }).then((result)=>{
          if(result.isConfirmed){
            this.name = result.value
            this.score.name = this.name
            this.score.cardType = this.cardType
            this.score.score = this.scoreTotal
            this.scoreService.addScore(this.score).subscribe((response)=>{
              this.choixCard()
            }, (err)=>{
              console.error(err.error)
            })
          }
        })
      } else{
        this.choixCard()
      }
    })
  }

  getTopScore(cardType : string){
    this.scoreService.getTopScore(cardType).subscribe((result)=>{
      this.topScores = result
    }, (err)=>{
      console.error(err.error)
    })
  }

  // Remet à 0 le jeu (timeline, cardDeck, timer)
  resetAllGame(): void {
    this.cardDeck.splice(0);
    this.timelineDeck.splice(0);
    this.hideHandCard();
    this.hasGameStarted.value = false;
    clearInterval(this.interval);
    this.initTimer();
  }

  // Remet le timer à 0
  initTimer() {
    this.timerObject.minute = Math.floor(this.temps / 60);
    this.timerObject.second = this.temps % 60;
  }

  // Permet de ne pas afficher la main du joueur au démarrage
  hideHandCard() {
    this.showHandCard.value = false;
  }

  // Ajoute 2 secondes de pénalité quand le joueur fait une erreur
  addPenalty() {
    this.timerObject.second -= 2;
    if (this.timerObject.second < 0) {
      this.timerObject.displayZero = "";
      this.timerObject.second = 59;
      this.timerObject.minute--;
    }
  }
}
