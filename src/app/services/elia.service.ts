
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';
import { ClientesBD, PDV } from '../models/pdv';
import { Articulos, Productos, ProductosBD } from '../models/productos';
import { RolVisita, Ruta, Visita } from '../models/ruta';
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

  async guardarSKUS( productos: Productos[] ){
    let produc: Productos[] = [];
    let produc2: Productos[] = [];

    produc = await this.cargarProductos();
    if (produc !== null ){
      produc2 = produc.concat(productos);
    } else {
      produc2 = productos.slice(0);
    }
    this.storage.set( 'ELIAProductos', produc2 );
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
      //test = environment.TestURL;
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

  syncClientes( ruta: string, admin: boolean ){   // admin = true si se invoca la sync desde Admin o false de lo contrario
    let cliente: PDV;
    let clientes: PDV[] = [];
    let i: number = 0;
    const dia = new Date().getDay();
    console.log('Dia: ', dia);

    this.presentaLoading('Sincronizando Clientes...');
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
        const max = clientes.length;
        clientes.forEach( d => {
          this.syncProductos( d.idWM, i, max, admin );
          i++
        });
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

  private getProductos( idCliente: string ){
    const URL = this.getIMAURL( environment.productosURL, idCliente );
    return this.http.get<ProductosBD[]>( URL );
  }

  syncProductos( idCliente: string, i: number, max: number, admin: boolean ){
    let item: Productos;
    let productos: Productos[] = [];

    if ( i === 0 ){
      this.storage.remove('ELIAProductos');
    }
    this.getProductos( idCliente ).subscribe(
      resp => {
        console.log(`ProductosBD (${idCliente})`, resp );
        resp.forEach(e => {
          item = new Productos( e.id.toString(), e.idCliente, e.idProduc, e.nombre, e.precio, e.codigoBarras, e.codigoBarras, e.stockMinimo);
          productos.push( item );
        });
        this.guardarSKUS( productos );
        if ( i === max-1 ){
          if (admin){                                      // En admin el rutero se carga al salir del modal.  En Sincronización de Mecadristas se hace acá
            this.modalCtrl.dismiss({'check': true});
          } else {
            this.tareas.cargarRutero();
          }
        }
      }, error => {
        console.log(error.message);
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
        this.loadingDissmiss();
      }, error => {
        console.log(error.message);
        this.loadingDissmiss();
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

  private getID( fecha: Date ){
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
    return `${year}${mes}${dia}`
  }

  insertRutero( rutero: VisitaDiaria ){
    let item: RuteroBD = {
      ID:             '',
      ruta:           this.tareas.varConfig.ruta,
      idCliente:      rutero.idPDV,
      nombre:         rutero.nombre,
      checkIn:        rutero.checkIn,
      checkBodega:    rutero.checkBodega,
      checkOut:       rutero.checkOut,
      latitud:        rutero.latitud,
      longitud:       rutero.longitud,
      idMercaderista: rutero.idMercaderista,
      observaciones:  rutero.observaciones,
      orden:          rutero.orden
    }

    item.ID =  this.getID( rutero.checkIn );
    rutero.ID = item.ID;
    const fecha = rutero.checkIn;
    item.checkIn = new Date(fecha.getTime() - (fecha.getTimezoneOffset() * 60000));
    this.putRutero( item ).subscribe(
      resp => {
        console.log('Rutero Insertado...', resp);
        this.tareas.presentaToast('Información Actualizada...');
      }, error => {
        console.log('Error Actualizando Cliente ', error.message);
        this.tareas.presentaToast('Error de Envío...!!!');
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
      ruta:           this.tareas.varConfig.ruta,
      nombre:         rutero.nombre,
      checkIn:        rutero.checkIn,
      checkBodega:    rutero.checkBodega,
      checkOut:       rutero.checkOut,
      latitud:        rutero.latitud,
      longitud:       rutero.longitud,
      idMercaderista: rutero.idMercaderista,
      observaciones:  rutero.observaciones,
      orden:          rutero.orden
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
        item = new RuteroDetBD( ID, idCliente, d.idProducto, d.nombre, d.stock, d.justificacion, d.vencimiento, d.cant_Vence );
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

  private postVisitas( visitaDiaria: Visita ){
    const URL = this.getIMAURL( environment.visitaDiaria, '' );
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
    };
    return this.http.post( URL, JSON.stringify(visitaDiaria), options );
  }

  syncVisitas( varConfig: Ruta ){
    let visita: Visita = {
      ID:             this.getID( varConfig.horaSincroniza ),
      ruta:           varConfig.ruta,
      horaSincroniza: new Date(), // new Date(varConfig.horaSincroniza).getTime() - (new Date(varConfig.horaSincroniza).getTimezoneOffset() * 60000)
      horaAlmuerzo:   null,
      latitud1:       varConfig.latitud1,
      longitud1:      varConfig.longitud1,
      idMercarista:   varConfig.idMercarista,
      latitud2:       null,
      longitud2:      null,
    }
    this.postVisitas ( visita ).subscribe(
      resp => {
        console.log('Info de Sincronización enviada...', resp);
      }, error => {
        console.log('Error de Envío de Sincronización', error.message);
      }
    )
  }

  private putVisitas( visitaDiaria: Visita ){
    const URL = this.getIMAURL( environment.visitaDiaria, `?id=${visitaDiaria.ID}&ruta=${visitaDiaria.ruta}` );
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
    };
    return this.http.put( URL, JSON.stringify(visitaDiaria), options );
  }
  
  updateVisitas( varConfig: Ruta ){
    let visita: Visita = {
      ID:             this.getID( varConfig.horaSincroniza ),
      ruta:           varConfig.ruta,
      horaSincroniza: new Date(new Date(varConfig.horaSincroniza).getTime() - (new Date(varConfig.horaSincroniza).getTimezoneOffset() * 60000)),
      horaAlmuerzo:   new Date(new Date(varConfig.horaAlmuerzo).getTime() - (new Date(varConfig.horaAlmuerzo).getTimezoneOffset() * 60000)),
      latitud1:       varConfig.latitud1,
      longitud1:      varConfig.longitud1,
      idMercarista:   varConfig.idMercarista,
      latitud2:       varConfig.latitud2,
      longitud2:      varConfig.longitud2,
    }
    this.putVisitas ( visita ).subscribe(
      resp => {
        console.log('Info de Ruta Actualizada...', resp);
      }, error => {
        console.log('Error de Envío de datos de Ruta', error.message);
      }
    )
  }

}
