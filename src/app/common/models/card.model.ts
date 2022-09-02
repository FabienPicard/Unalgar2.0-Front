//Modélisation des cartes de jeu
export class Card {
  public title: string;
  public date: string;
  public img: string;

  constructor(title: string, date: string, img: string) {
    this.title = title;
    this.date = date;
    this.img = img;
  }
}
