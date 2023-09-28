/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ClientesBD, PDV } from '../models/clientes';
import { RolVisita, Visita, Usuarios } from '../models/ruta';
import { DetalleVisita, RuteroBD, RuteroDetBD,   } from '../models/rutero';
import { AlertController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImaService {

  pdvs:             PDV[] = [];
  rolVisita:        RolVisita[] = [];
  rutero:           any[] = [];
  visitas:          Visita[] = [];
  totalClientes = 0;
  totalRutas = 0;
  totalVisitados = 0;
  totalEnProceso = 0;
  totalPendientes = 0;
  fecha:            Date = new Date();
  id = '';
  logging:          boolean = false;

  usuarios: Usuarios = {
    empleado: '',
    usuario:  '',
    clave:    '',
    email:    '',
    nombre:   '',
  }

  constructor( private http: HttpClient,
               private alertCtrl: AlertController ) {
    this.id = this.getID(this.fecha);
  }

  async presentAlertW( subtitulo: string, mensaje: string ) {
    const alert = await this.alertCtrl.create({
      header: 'Warning',
      subHeader: subtitulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  private getEXURL( api: string, id: string ){
    let test = '';

    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }
    const URL = environment.preEXURL + test + environment.postEXURL + api + id;
    console.log(URL);
    return URL;
  }

  private getIMAURL( api: string, id: string ){
    const URL = environment.IMAURL + api + id;
    console.log(URL);
    return URL;
  }

  private getISAURL( api: string, id: string ){
    const URL = environment.ISAURL + api + id;
    console.log(URL);
    return URL;
  }

  getUsuarios( id: string ){
    const URL = this.getISAURL( environment.usersIMAURL, id );
    return this.http.get<Usuarios[]>( URL );
  }

  postClientes( cliente: ClientesBD ){
    const URL = this.getIMAURL( environment.clientesIMAURL, '' );
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
    };
    return this.http.post( URL, JSON.stringify(cliente), options );
  }

  getISAClientes(){
    const URL = this.getEXURL( environment.clientesISAURL, '' );
    return this.http.get<ClientesBD[]>( URL );
  }

  getIMAClientes(){
    const URL = this.getIMAURL( environment.clientesIMAURL, '' );
    return this.http.get<ClientesBD[]>( URL );
  }


  syncGetClientesToPromise(){
    return lastValueFrom(this.getISAClientes());
  }

  syncClientes(){
    let cliente: PDV;
    let clientes: PDV[] = [];

    // this.presentaLoading('Sincronizando...');
    this.getISAClientes().subscribe(
      resp => {
        console.log('ClientesBD', resp );
        resp.forEach(e => {
          cliente = new PDV( e.cod_Zon, e.cod_Clt, e.nom_Clt, e.dir_Clt, e.nom_Cto, e.num_Tel, '', e.latitud, e.longitud, e.codigo_WM);
          clientes.push( cliente );
        });
        console.log( 'Arreglo', clientes );
        if (localStorage.getItem('IMAclientes')){
          localStorage.removeItem('IMAclientes');
        }
        localStorage.setItem('IMAclientes', JSON.stringify(clientes));
        this.cargarClientes();
      }, error => {
        console.log(error.message);
      }
    );
  }

  cargarClientes(){
    this.pdvs = JSON.parse(localStorage.getItem('IMAclientes')!) || [];
  }

  cargarRutero(id: string){
    let hoy: any[] = [];
    let cargar = false;      // Si cargar = true, se debe recargar el rutero por cambio de día

    if (localStorage.getItem('IMAvisitaDiaria')){  
      let local:any = localStorage.getItem('IMAvisitaDiaria');
              // Si IMAvisitaDiaria tiene información se valida si es del día a procesar, sino se recarga
      this.rutero = JSON.parse(local);
      hoy = this.rutero.filter(d => d.ID === id);
      if (hoy.length === 0){                              // Sino hay información de hoy se procede a recargar
        this.rutero = [];
        localStorage.removeItem('IMAvisitaDiaria');
        cargar = true;
      } else {
        // cargar estadisticas
        this.estadisticas();
      }
    } else {
      cargar = true;
    }
    if (cargar){
      this.syncRuteroWeb( id );
    }
  }

  getDia( dia: number ){
    if (dia === 1){
      return 'L';
    } else if (dia === 2){
      return 'K';
    } else if (dia === 3){
      return 'M';
    } else if (dia === 4){
      return 'J';
    } else if (dia === 5){
      return 'V';
    } else if (dia === 6){
      return 'S';
    } else {
      return 'D';
    }
  }

  getID( fecha: Date ){
    let day = new Date(fecha).getDate();
    let month = new Date(fecha).getMonth() + 1;
    let year = new Date(fecha).getFullYear();
    let dia: string = day.toString();
    let mes: string = month.toString();

    if ( month >= 0 && month <= 9 ) {
    mes = `0${month}`;
    }
    if ( day >= 0 && day <= 9 ){
    dia = `0${day}`;
    }
    return `${year}${mes}${dia}`;
  }

  private estadisticas(){
    let ruta = '';
    this.totalClientes = 0;
    this.totalRutas = 0;
    this.totalVisitados = 0;
    this.totalEnProceso = 0;
    this.totalPendientes = 0;

    this.totalClientes = this.rutero.length;
    this.rutero.forEach( d => {
      if ( ruta !== d.ruta ){
        this.totalRutas += 1;
        ruta = d.ruta;
      }
      if ( d.visitado === 10 ){
        this.totalVisitados += 1;
      }
      if ( d.visitado === 1 ){
        this.totalEnProceso += 1;
      }
      this.totalPendientes = this.totalClientes - this.totalVisitados;
    });
  }

  private guardarVisitas(){
    localStorage.setItem('IMAvisitaDiaria', JSON.stringify(this.rutero));
  }

  syncRuteroWeb( id: string ){
    let visita: any;

    this.getRuteroWeb( id ).subscribe(
      resp => {
        console.log('Rutero Web: ', resp );
        this.rutero = [];
        if ( this.rutero.length === 0 ){     // Se está llenando el rutero por primera vez
          resp.forEach( d => {
           // visita = new any( d.id, d.idCliente, d.ruta, d.nombre, '', d.latitud, d.longitud, d.idMercaderista, d.orden);
            //this.rutero.push( visita );
          });
          this.guardarVisitas();
        }
        this.actualizarRutero(resp);
        this.actualizarRuteroDet();
        this.estadisticas();
      }, error => {
        console.log(error.message);
      }
    );
  }

  private getRuteroWeb( id: string ){
    const URL = this.getISAURL( environment.ruteroPostURL, id );
    return this.http.get<RuteroBD[]>( URL );
  }

  private actualizarRutero( ruteroWeb: RuteroBD[] ){
    let i: number;

    if (ruteroWeb.length > 0){
      ruteroWeb.forEach( d => {
        i = this.rutero.findIndex( e => e.ID === d.id && e.idPDV === d.idCliente );
        if ( i >= 0 ){
          this.rutero[i].checkIn = d.checkIn;
          this.rutero[i].checkBodega = d.checkBodega;
          this.rutero[i].checkOut = d.checkOut;
          this.rutero[i].latitud = d.latitud;
          this.rutero[i].longitud = d.longitud;
          this.rutero[i].observaciones = d.observaciones;
          if ( d.checkIn !== null ){
            this.rutero[i].visitado = 1;
            this.rutero[i].color = 'primary';
          }
          if ( d.checkOut !== null ){
            this.rutero[i].visitado = 10;
            this.rutero[i].color = 'success';
          }
        }
      });
      this.guardarVisitas();
    }
  }

  private actualizarRuteroDet(){
    console.log('Actualizando el Detalle del Rutero...');
    if (this.rutero.length > 0){
      for (let i = 0; i < this.rutero.length; i++) {
        if (this.rutero[i].visitado === 10 && this.rutero[i].detalle.length === 0 ){
          this.syncRuteroDet( i );
        }
      }
    }
  }

  private syncRuteroDet( i: number ){
    let detalle: DetalleVisita[] = [];
    let item: DetalleVisita;

    this.getRuteroDet( this.rutero[i].ID, this.rutero[i].idPDV ).subscribe(
      resp => {
        console.log('Rutero Web: ', resp );
        resp.forEach( d => {
          item = new DetalleVisita(d.idProducto, d.nombre, '', '', d.stock, false, '', d.justificacion, d.vencimiento, d.cant_Vencen);
          detalle.push(item);
        });
        this.rutero[i].detalle = detalle.slice(0);
        this.guardarVisitas();
      }, error => {
        console.log(error.message);
      }
    );
  }

  private getRuteroDet( id: string, idCliente: string ){
    const URL = this.getISAURL( environment.detalleRutURL, `?ID=${id}&idCliente=${idCliente}` );
    return this.http.get<RuteroDetBD[]>( URL );
  }

  private getVisitaDiaria( id: string ){
    const URL = this.getISAURL( environment.visitaDiariaURL, id );
    return this.http.get<Visita[]>( URL );
  }

  syncVisitaDiaria( id: string ){
    this.getVisitaDiaria( id ).subscribe(
      resp => {
        console.log('Visita Diaria: ', resp);
        this.visitas = resp.slice(0);
      }, error => {
        console.log('Error consultando Visita Diaria: ', error.message);
      }
    )
  }

}
