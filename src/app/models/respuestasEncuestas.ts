export class RespuestasEncuestas {
    constructor(
    public id:number,
    public encuesta:string,
    public linea:number,
    public usuario:string,
    public fecha:Date,
    public respuesta:string    
    ){}
}