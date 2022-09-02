export class Message{
    public typeReponse : boolean
    public textReponse : string

    constructor(reponse:boolean, text:string){
        this.typeReponse = reponse
        this.textReponse = text
    }
}
