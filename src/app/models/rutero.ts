
/**
 * export class VisitaDiaria {
    ID: string;
    ruta: string;
    idPDV: string;
    nombre: string;
    horaVisita: string;
    checkIn: Date;
    checkBodega: Date;
    checkOut: Date;
    latitud: number;
    longitud: number;
    visitado: number;       // 0 = Sin visitar, 1 = visita en proceso, 10 = Visita Terminada
    idMercaderista: string;
    observaciones: string;
    orden: number;
    color: string;
    detalle: DetalleVisita[] = [];

/**
 *     constructor ( id: string, idPdv: string, ruta: string, nombre: string, horaVisita: string, latitud: number, longitud: number, idMercaderista: string, orden: number ){
        this.idPDV = idPdv;
        this.ruta = ruta;
        this.nombre = nombre;
        this.horaVisita = horaVisita;
        this.checkIn = null;
        this.checkBodega = null;
        this.checkOut = null;
        this.latitud = latitud;
        this.longitud = longitud;
        this.visitado = 0;
        this.idMercaderista = idMercaderista;
        this.observaciones = '';
        this.orden = orden;
        this.ID = id;
        this.color = 'danger';
    }
 */



export class DetalleVisita {
    constructor ( public idProducto: string, 
                  public nombre: string, 
                  public codBarras: string, 
                  public barrasCliente: string, 
                  public stock: number = 0, 
                  public seleccionado: boolean = false,
                  public imagen: string = '../../../assets/icon/ok.png',
                  public justificacion: string | any , 
                  public vencimiento: Date | any,
                  public cantidadVencen: number | any
    ){}
}

export interface RuteroBD {
    id:             string;
    ruta:           string;
    idCliente:      string;
    nombre:         string;
    checkIn:        Date;
    checkBodega:    Date;
    checkOut:       Date;
    latitud:        number;
    longitud:       number;
    idMercaderista: string;
    observaciones:  string;
    orden:          number;
}

export class RuteroDetBD {
    constructor (
        public id:         string,
        public idCliente:  string,
        public idProducto: string,
        public nombre:     string,
        public stock:      number,
        public justificacion: string,
        public vencimiento: Date,
        public cant_Vencen: number
    ){}
}

