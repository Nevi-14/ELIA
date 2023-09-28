export class ImaEncuestas {
    constructor(
    public id:    number,
    public descripcion: string,
    public fecha:     Date,
    public vigencia_Inicio:   Date,
    public vigencia_Fin:   Date,
    public observaciones:string
    ){}
}
