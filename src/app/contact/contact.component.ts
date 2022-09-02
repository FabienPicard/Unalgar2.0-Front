import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { User } from "../common/models/user.model";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"],
})
export class ContactComponent implements OnInit {
  imageLogoTeam = "../../assets/img/teamU.png";

  //Adresse
  nom: string = "Wild Code School";
  adress: any = { street: "17 rue Delandine", city: "69002 Lyon" };
  telephoneNumber: string = "06 40 95 24 24";

  //Nous retrouvez
  logoFacebook : string = "logoFacebook"
  logoTwitter : string = "logoTwitter"
  logoInstagram : string = "logoInstagram"
  logoGithub : string = "logoGithub"

  imageFb = "../../assets/img/fb.png";
  imageTwitter = "../../assets/img/twit.png";
  imageInstagram = "../../assets/img/inst.png";
  imageGithub = "../../assets/img/git.png";

  user: User = new User();

  constructor() {}

  ngOnInit(): void {}

  onSubmit() {
    Swal.fire({
      icon: "success",
      text: "Le message a bien été envoyé",
      confirmButtonText: "Ok",
    });}
}
