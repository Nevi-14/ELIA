

export class PDV {
    nombre:     string;
    id:         string;
    direccion:  string;
    contacto:   string;
    telefonoContacto: string;
    diasVisita: string;
    horaVisita: string;
    latitud:    string;
    longitud:   string;
    visitado:   boolean;

    constructor( id: string, nombre: string, direccion: string, contacto: string, telContacto: string, dias: string, hora: string, latitud: string, longitud: string ){
      this.nombre = nombre;
      this.id = id;
      this.direccion = direccion;
      this.contacto = contacto;
      this.telefonoContacto = telContacto;
      this.diasVisita = dias;
      this.horaVisita = hora;
      this.latitud = latitud;
      this.longitud = longitud;
      this.visitado = false;
    }
}

export const PDVS = [
    {
      nombre: "Auto Mercado Centro",
      id: "1",
      direccion: "San Jose centro",
      contacto: "Carlos Alvarado",
      telefonoContacto: "60516051",
      diasVisita: "0X0XXX0",
      horaVisita: "800",
      latitud: "",
      longitud: "",
      visitado: true,
    },
    {
        nombre: "Auto Mercado Los Yoses",
        id: "2",
        direccion: "San Jose Los Yoses",
        contacto: "Carlos Alvarado",
        telefonoContacto: "60516051",
        diasVisita: "0X0XXX0",
        horaVisita: "900",
        latitud: "",
        longitud: "",
        visitado: true,
      },
      {
        nombre: "Auto Mercado Plaza Mayor",
        id: "3",
        direccion: "Pavas, San Jose",
        contacto: "Carlos Alvarado",
        telefonoContacto: "60516051",
        diasVisita: "0X0XXX0",
        horaVisita: "1100",
        latitud: "",
        longitud: "",
        visitado: false,
      },
      {
        nombre: "Auto Mercado Multiplaza",
        id: "4",
        direccion: "Guachipelin de Escazú",
        contacto: "Carlos Alvarado",
        telefonoContacto: "60516051",
        diasVisita: "0X0XXX0",
        horaVisita: "1300",
        latitud: "",
        longitud: "",
        visitado: false,
      },
      {
        nombre: "Auto Mercado Heredia",
        id: "5",
        direccion: "Heredia",
        contacto: "Carlos Alvarado",
        telefonoContacto: "60516051",
        diasVisita: "0X0XXX0",
        horaVisita: "1400",
        latitud: "",
        longitud: "",
        visitado: false,
      },
      {
        nombre: "Auto Mercado Santa Ana",
        id: "6",
        direccion: "Santa Ana, Sam José",
        contacto: "Carlos Alvarado",
        telefonoContacto: "60516051",
        diasVisita: "0X0XX00",
        horaVisita: "1500",
        latitud: "",
        longitud: "",
        visitado: false,
      },
      {
        nombre: "Auto Mercado Herradura",
        id: "7",
        direccion: "Herradura, Garabito",
        contacto: "Carlos Alvarado",
        telefonoContacto: "60516051",
        diasVisita: "00X0000",
        horaVisita: "1700",
        latitud: "",
        longitud: "",
        visitado: false,
      },
      {
        nombre: "Auto Mercado Alajuela",
        id: "8",
        direccion: "Alajuela",
        contacto: "Carlos Alvarado",
        telefonoContacto: "60516051",
        diasVisita: "0X00000",
        horaVisita: "800",
        latitud: "",
        longitud: "",
        visitado: false,
      },
      {
        nombre: "Auto Mercado Tres Rios",
        id: "9",
        direccion: "Tres Rios, La Unión",
        contacto: "Carlos Alvarado",
        telefonoContacto: "60516051",
        diasVisita: "00X0000",
        horaVisita: "900",
        latitud: "",
        longitud: "",
        visitado: false,
      },
      {
        nombre: "Auto Mercado La Guacima",
        id: "10",
        direccion: "La Guacima, Alajuela",
        contacto: "Carlos Alvarado",
        telefonoContacto: "60516051",
        diasVisita: "00X0000",
        horaVisita: "1100",
        latitud: "",
        longitud: "",
        visitado: false,
      },
]
