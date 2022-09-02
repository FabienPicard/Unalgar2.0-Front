import { Injectable } from "@angular/core";
import { Message } from "../models/message.model";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  listeMessage: Message[] = [];
  constructor() {}

  addMessage(message: Message) {
    this.listeMessage.push(message);

    setTimeout(() => {
      this.listeMessage.shift();
    }, 800);
  }
}
