export class EncuestasClienteVista {
    constructor(
     public   id: string,
     public descripcion: string,
     public  fecha: Date,
     public   vigencia_Inicio: Date,
     public  vigencia_Fin: Date,
     public  observaciones: string,
     public encuesta_Linea_ID: number,
     public  pregunta: string,
     public  repite: number,
     public  tipo_Respuesta: string,
     public datos:string,
     public   cliente: number,
     public nom_Clt: string,
     public repeticioneS_RESTANTES:number

    ){}
}