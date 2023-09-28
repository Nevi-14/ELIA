export class RespuestasEncuestas {
    constructor(
    public id:number,
    public iD_ENCUESTA_LINEA:number,
    public usuario:string,
    public fecha:Date,
    public respuesta:string    
    ){}
}