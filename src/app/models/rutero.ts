
export class VisitaDiaria {
    idPDV: string;
    nombre: string;
    horaVisita: string;
    checkIn: Date;
    checkBodega: Date;
    checkOut: Date;
    latitud: string;
    longitud: string
    transmitido: boolean;
    visitado: boolean;
    idMercaderista: string;
    observaciones: string;
    detalle: DetalleVisita[] = [];

    constructor ( id: string, nombre: string, horaVisita: string, latitud: string, longitud: string, idMercaderista: string ){
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
    }
}

export class DetalleVisita {
    idProducto: string;
    nombre: string;
    codigoBarras: string;
    barrasCliente: string;
    stock: number;          // 0 = normal; 1 = bajo Stock; -1 = faltante
    seleccionado: boolean;
    imagen: string;

    constructor ( id: string, nombre: string, codBar: string, barCliente: string ){
        this.idProducto = id;
        this.nombre = nombre;
        this.codigoBarras = codBar;
        this.barrasCliente = barCliente;
        this.stock = 0;
        this.seleccionado = false;
        this.imagen = "../../../assets/icon/ok.png";
    }
}
