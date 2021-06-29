

export class VisitaDiaria {
    ID: string;
    idPDV: string;
    nombre: string;
    horaVisita: string;
    checkIn: Date;
    checkBodega: Date;
    checkOut: Date;
    latitud: number;
    longitud: number;
    transmitido: boolean;
    visitado: boolean;
    idMercaderista: string;
    observaciones: string;
    orden: number;
    detalle: DetalleVisita[] = [];

    constructor ( id: string, nombre: string, horaVisita: string, latitud: number, longitud: number, idMercaderista: string, orden: number ){
        this.idPDV = id;
        this.nombre = nombre;
        this.horaVisita = horaVisita;
        this.checkIn = null;
        this.checkBodega = null;
        this.checkOut = null;
        this.latitud = latitud;
        this.longitud = longitud;
        this.transmitido = false;
        this.visitado = false;
        this.idMercaderista = idMercaderista;
        this.observaciones = null;
        this.orden = orden;
        this.ID = '';
    }
}

export class DetalleVisita {
    constructor ( public idProducto: string, 
                  public nombre: string, 
                  public codBarras: string, 
                  public barrasCliente: string, 
                  public stock: number = 0, 
                  public seleccionado: boolean = false,
                  public imagen: string = '../../../assets/icon/ok.png',
                  public justificacion: string = null ){}
}

export interface RuteroBD {
    ID:             string;
    idCliente:      string;
    nombre:         string;
    checkIn:        Date;
    checkBodega:    Date;
    checkOut:       Date;
    latitud:        number;
    longitud:       number;
    idMercaderista: string;
    observaciones:  string;
}

export class RuteroDetBD {
    constructor (
        public ID:         string,
        public idCliente:  string,
        public idProducto: string,
        public nombre:     string,
        public stock:      number,
        public justificacion: string,
    ){}
}
