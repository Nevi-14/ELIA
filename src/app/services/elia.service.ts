
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ClientesBD, PDV } from '../models/pdv';
import { Productos, ProductosBD } from '../models/productos';
import { RolVisita, Ruta } from '../models/ruta';
import { TareasService } from './tareas.service';

@Injectable({
  providedIn: 'root'
})
export class EliaService {

  constructor( private http: HttpClient,
               private tareas: TareasService ) { }
  
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

    // this.presentaLoading('Sincronizando...');
    this.getClientes(ruta).subscribe(
      resp => {
        console.log('ClientesBD', resp );
        resp.forEach(e => {
          cliente = new PDV( e.cod_Clt, e.nom_Clt, e.dir_Clt, e.nom_Cto, e.num_Tel, '-------', '', e.latitud, e.longitud)
          clientes.push( cliente );
        });
        console.log( 'Arreglo', clientes );
        if (localStorage.getItem('IMAclientes')){
          localStorage.removeItem('IMAclientes');
        }
        localStorage.setItem('IMAclientes', JSON.stringify(clientes));
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
          localStorage.setItem('IMAclientes', JSON.stringify(this.tareas.pdvs));
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

    // this.presentaLoading('Sincronizando...');
    this.getProductos().subscribe(
      resp => {
        console.log('ProductosBD', resp );
        resp.forEach(e => {
          item = new Productos( e.id.toString(), e.idCliente, e.nombre, e.precio, e.codigoBarras, e.barrasCliente);
          productos.push( item );
        });
        console.log( 'Arreglo', productos );
        // Debemos guardar en Storage los productos
      }, error => {
        console.log(error.message);
      }
    );
  }

}
