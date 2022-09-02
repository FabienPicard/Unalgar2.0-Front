import { Component, OnInit } from "@angular/core";
import { Card } from "../common/models/card.model";
import { GameService } from "../common/services/game.service";
import { MessageService } from "../common/services/message.service";
import { Message } from "../common/models/message.model";

import Swal from "sweetalert2";
@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit {
  // initialisation des variables
  public timelineDeck: Card[] = [];
  public listeMessage: Message[];
  playingCard: Card;
  firstCard: Card;

  // INJECTION DU SERVICE
  constructor(
    private gameService: GameService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.listeMessage = this.messageService.listeMessage;
  }

  //Réception de la carte de jeu avant envoi dans la main du joueur
  onReceiveplayingCard($event: Card): void {
    this.playingCard = $event;
  }

  
}
