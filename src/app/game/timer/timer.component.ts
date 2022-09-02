import { Component, OnInit } from "@angular/core";
import { GameService } from "src/app/common/services/game.service";
import { Status } from "src/app/common/models/status.model";
import { Timer } from "src/app/common/models/timer.model";
import { Score } from "src/app/common/models/score.model";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: "app-timer",
  templateUrl: "./timer.component.html",
  styleUrls: ["./timer.component.css"],
})
export class TimerComponent implements OnInit {
  timerObject: Timer;
  hasGameStarted: Status;
  isDateRight: Status;
  topScore : Score[] = []

  constructor(public gameService: GameService, private router: Router) {}

  ngOnInit(): void {
    this.timerObject = this.gameService.timerObject;
    if (this.timerObject.second < 10) {
      this.timerObject.displayZero = "0";
    } else {
      this.timerObject.displayZero = "";
    }
    this.hasGameStarted = this.gameService.hasGameStarted;
    this.isDateRight = this.gameService.isDateRight;
  }

  confirmeRetour(): void {
    Swal.fire({
      title: "Voulez-vous vraiment quitter la partie ?",
      heightAuto:false,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, je veux quitter la partie",
      cancelButtonText: "Non, je veux rester",
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetGoBackHome();
      }
    });
  }

  //la fonction doit reset la timeline mais elle renvoie aussi a l'accueil
  resetGoBackHome(): void {
    //je reset les cartes de la timeline
    this.gameService.resetAllGame();
    // je redirige vers l'accueil
    this.router.navigate([""]);
  }

}
