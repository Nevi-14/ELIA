export class EncuestasClienteVista {
    constructor(
     public   id: string,
     public descripcion: string,
     public   cliente: number,
     public  fecha: Date,
     public   vigencia_Inicio: Date,
     public  vigencia_Fin: Date,
     public  observaciones: string,
     public linea: number,
     public  pregunta: string,
     public  tipo_Respuesta: string,
     public  repite: number,
     public  datos: string

    ){}
}