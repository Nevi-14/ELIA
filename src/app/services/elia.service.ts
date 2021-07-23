
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';
import { ClientesBD, PDV } from '../models/pdv';
import { Articulos, Productos, ProductosBD } from '../models/productos';
import { RolVisita, Ruta } from '../models/ruta';
import { DetalleVisita, RuteroBD, RuteroDetBD, VisitaDiaria } from '../models/rutero';
import { TareasService } from './tareas.service';

@Injectable({
  providedIn: 'root'
})
export class EliaService {

  loading: HTMLIonLoadingElement;

  constructor( private http: HttpClient,
               private storage: Storage,
               private modalCtrl: ModalController,
               private tareas: TareasService,
               private loadingCtrl: LoadingController ) {
    this.crearBD();
  }
  
  async crearBD(){
    await this.storage.create();
  }

  private async presentaLoading( mensaje: string ){
    this.loading = await this.loadingCtrl.create({
      message: mensaje,
    });
    await this.loading.present();
  }

  private loadingDissmiss(){
    this.loading.dismiss();
  }

  guardarSKUS( productos: Productos[] ){
    this.storage.set( 'ELIAProductos', productos );
  }

  private guardarArticulos( productos: Articulos[] ){
    this.storage.set( 'ELIArticulos', productos );
  }

  async cargarProductos(){
    let productos: Productos[] = [];

    const prod = await this.storage.get( 'ELIAProductos' );
    productos = prod;
    return productos;
  }

  async cargarArticulos(){
    let productos: Articulos[] = [];

    const prod = await this.storage.get( 'ELIArticulos' );
    productos = prod;
    return productos;
  }
  
  private getISAURL( api: string, id: string ){
    let test: string = '';

    if ( !environment .prdMode ) {
      test = environment.TestURL;
    }
    const URL = environment.preURL + test + environment.postURL + api + id;
    console.log(URL);
    return URL;
  }

  private getIMAURL( api: string, id: string ){
    const URL = environment.IMAURL + api + id;
    console.log(URL);
    return URL;
  }

  getRutas(){
    const URL = this.getISAURL( environment.rutasURL, '' );
    return this.http.get<Ruta[]>( URL );
  }

  private getClientes( ruta: string ){
    const URL = this.getISAURL( environment.clientesURL, ruta );
    return this.http.get<ClientesBD[]>( URL );
  }

  syncClientes( ruta: string ){
    let cliente: PDV;
    let clientes: PDV[] = [];
    const dia = new Date().getDay();
    console.log('Dia: ', dia);

    //this.presentaLoading('Sincronizando...');
    this.getClientes(ruta).subscribe(
      resp => {
        console.log('ClientesBD', resp );
        resp.forEach(e => {
          cliente = new PDV( e.cod_Clt, e.nom_Clt, e.dir_Clt, e.nom_Cto, e.num_Tel, '-------', '', e.latitud, e.longitud, e.codigo_WM);
          clientes.push( cliente );
        });
        console.log( 'Arreglo', clientes );
        if (localStorage.getItem('ELIAclientes')){
          localStorage.removeItem('ELIAclientes');
        }
        localStorage.setItem('ELIAclientes', JSON.stringify(clientes));
        this.tareas.cargarClientes();
        this.syncRolVisita( ruta, this.getDia( dia ) );
      }, error => {
        console.log(error.message);
      }
    );
  }

  private getDia( dia: number ){
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

  private getRolVisita( dia: string ){
    const URL = this.getISAURL( environment.rolVisitaURL, dia );
    return this.http.get<RolVisita[]>( URL );
  }

  syncRolVisita( ruta: string, dia: string ){
    let i: number;

    this.getRolVisita(dia).subscribe(
      resp => {
        console.log('Rol de Visita dia: ', resp );
        const rol = resp.filter( d => d.ruta === ruta );
        console.log('Rol de Visita ', rol );
        if ( rol !== undefined ) {
          rol.forEach(e => {
            i = this.tareas.pdvs.findIndex( d => d.id === e.cliente );
            if ( i >= 0 ){
              this.activarDia( i, e.dia );
              this.tareas.pdvs[i].orden = e.orden;
            } else {
              console.log('Cliente no encontrado: ', e.cliente);
            }
          });
          localStorage.setItem('ELIAclientes', JSON.stringify(this.tareas.pdvs));
        }
      }, error => {
        console.log(error.message);
      }
    );
  }

  private activarDia( i: number, dia: string ){
    let visitas: string[] = ['-','-','-','-','-','-','-'];

    if ( dia === 'L' ){
      visitas[0] = 'X';
    } else if ( dia === 'K' ) {
      visitas[1] = 'X';
    } else if ( dia === 'M' ) {
      visitas[2] = 'X';
    } else if ( dia === 'J' ) {
      visitas[3] = 'X';
    } else if ( dia === 'V' ) {
      visitas[4] = 'X';
    } else if ( dia === 'S' ) {
      visitas[5] = 'X';
    } else if ( dia === 'D' ) {
      visitas[6] = 'X';
    };
    this.tareas.pdvs[i].diasVisita = visitas.join('');
  }

  private getProductos(){
    const URL = this.getIMAURL( environment.productosURL, '' );
    return this.http.get<ProductosBD[]>( URL );
  }

  syncProductos(){
    let item: Productos;
    let productos: Productos[] = [];

    this.presentaLoading('Sincronizando...');
    this.getProductos().subscribe(
      resp => {
        console.log('ProductosBD', resp );
        resp.forEach(e => {
          item = new Productos( e.id.toString(), e.idCliente, e.idProduc, e.nombre, e.precio, e.codigoBarras, e.barrasCliente, e.stockMinimo);
          productos.push( item );
        });
        console.log( 'Arreglo', productos );
        this.guardarSKUS( productos );
        this.loadingDissmiss();
        this.modalCtrl.dismiss({'check': true});
      }, error => {
        console.log(error.message);
        this.loadingDissmiss();
      }
    );
  }

  private getArticulos(){
    const URL = this.getISAURL( environment.ArticulosURL, '' );
    return this.http.get<Articulos[]>( URL );
  }

  syncArticulos(){
    this.getArticulos().subscribe(
      resp => {
        console.log('Productos Isleña ', resp );
        this.guardarArticulos( resp );
      }, error => {
        console.log(error.message);
      }
    );
  }

  private postRutero( rutero: RuteroBD ){
    const URL = this.getIMAURL( environment.ruteroPostURL, '' );
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
    };
    return this.http.post( URL, JSON.stringify(rutero), options );
  }

  insertRutero( rutero: VisitaDiaria ){
    let item: RuteroBD = {
      ID:             '',
      idCliente:      rutero.idPDV,
      nombre:         rutero.nombre,
      checkIn:        rutero.checkIn,
      checkBodega:    rutero.checkBodega,
      checkOut:       rutero.checkOut,
      latitud:        rutero.latitud,
      longitud:       rutero.longitud,
      idMercaderista: rutero.idMercaderista,
      observaciones:  rutero.observaciones
    }

    let day = new Date(rutero.checkIn).getDate();
    let month = new Date(rutero.checkIn).getMonth() + 1;
    let year = new Date(rutero.checkIn).getFullYear();
    let dia: string = day.toString();
    let mes: string = month.toString();

    if ( month >= 0 && month <= 9 ) {
      mes = `0${month}`;
    }
    if ( day >= 0 && day <= 9 ){
      dia = `0${day}`;
    }
    item.ID = `${year}${mes}${dia}`;
    rutero.ID = item.ID;
    const fecha = rutero.checkIn;
    item.checkIn = new Date(fecha.getTime() - (fecha.getTimezoneOffset() * 60000));
    this.postRutero( item ).subscribe(
      resp => {
        console.log('Rutero Insertado...', resp);
      }, error => {
        console.log('Error Actualizando Cliente ', error.message);
      }
    )
  }

  private putRutero( rutero: RuteroBD ){
    const URL = this.getIMAURL( environment.ruteroPostURL, `?ID=${rutero.ID}&idCliente=${rutero.idCliente}` );
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
    };
    return this.http.put( URL, JSON.stringify(rutero), options );
  }

  updateRutero( rutero: VisitaDiaria ){
    let item: RuteroBD = {
      ID:             rutero.ID,
      idCliente:      rutero.idPDV,
      nombre:         rutero.nombre,
      checkIn:        rutero.checkIn,
      checkBodega:    rutero.checkBodega,
      checkOut:       rutero.checkOut,
      latitud:        rutero.latitud,
      longitud:       rutero.longitud,
      idMercaderista: rutero.idMercaderista,
      observaciones:  rutero.observaciones
    }
    const fechaIn = rutero.checkIn;
    const fechaBodega = rutero.checkBodega;
    const fechaOut = rutero.checkOut;
    item.checkIn = new Date(new Date(fechaIn).getTime() - (new Date(fechaIn).getTimezoneOffset() * 60000));
    item.checkOut = new Date(new Date(fechaOut).getTime() - (new Date(fechaOut).getTimezoneOffset() * 60000));
    item.checkBodega = new Date(new Date(fechaBodega).getTime() - (new Date(fechaBodega).getTimezoneOffset() * 60000));

    this.putRutero( item ).subscribe(
      resp => {
        console.log('Rutero Modificado...', resp);
        // Inserta detalle del rutero
        this.insertDetalleRutero( rutero.detalle, rutero.ID, rutero.idPDV );
      }, error => {
        console.log('Error Actualizando Cliente ', error.message);
      }
    );
    console.log(JSON.stringify(item));
  }

  private postRuteroDetalle( detalle: RuteroDetBD[] ){
    const URL = this.getIMAURL( environment.detalleRutURL, '' );
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
    };
    return this.http.post( URL, JSON.stringify(detalle), options );
  }

  private insertDetalleRutero( detalle: DetalleVisita[], ID: string, idCliente: string ){
    let array: RuteroDetBD[] = [];
    let item: RuteroDetBD;

    if (detalle.length > 0){
      detalle.forEach( d => {
        item = new RuteroDetBD( ID, idCliente, d.idProducto, d.nombre, d.stock, d.justificacion );
        array.push( item );
      });
      this.postRuteroDetalle( array ).subscribe(
        resp => {
          console.log('Insertado rutero Detalle. ', resp);
        }, error => {
          console.log('Error Insertando Rutero Detalle. ', error.message);
        }
      )
    }
  }

}
