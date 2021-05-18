import { Component, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { PDV } from 'src/app/models/pdv';
import { Productos, SKUS } from 'src/app/models/productos';
import { DetalleVisita } from 'src/app/models/rutero';
import { TareasService } from 'src/app/services/tareas.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-faltantes',
  templateUrl: './faltantes.page.html',
  styleUrls: ['./faltantes.page.scss'],
})
export class FaltantesPage {

  @Input() pdv: PDV;
  @Input() i: number;

  nombrePDV: string = '';
  texto: string;
  mostrarListaProd: boolean = false;
  sinSalvar: boolean = false;
  busquedaProd: Productos[] = [];

  constructor( private modalCtrl: ModalController,
               private tareas: TareasService,
               private alertCtl: AlertController ) {

    this.nombrePDV = this.tareas.pdvActivo.nombre;
    this.tareas.productos = SKUS.slice(0);
  }

  buscarProducto(){
    if ( !this.mostrarListaProd ){
      if (this.texto.length !== 0) {    
        this.busqueda();                  // Llena el arreglo BusquedaProd con los articulos que cumplen la seleccion
      }
    } else {
      console.log(this.busquedaProd);
      const listaAux = this.busquedaProd.filter( d => d.seleccionado );
      console.log(listaAux);
      if ( listaAux.length == 1 ){   // Un solo producto seleccionado
        this.busquedaProd = listaAux.slice(0);
        this.productoSelect(0);
      } else if ( listaAux.length > 1 ){          // Se seleccionaron varios productos
        this.busquedaProd = listaAux.slice(0);
        this.productoSelect( -1 );
      } else {                    // No se seleccionó ningún producto o se cambio el texto de seleccion
        this.busquedaProd = [];
        // this.mostrarListaProd = false;
        this.busqueda();
      }
    }
  }

  busqueda(){
    if (isNaN(+this.texto)) {            // Se buscará por código de producto
      // Se recorre el arreglo para buscar coincidencias
      // this.mostrarProducto = false;
      for (let i = 0; i < this.tareas.productos.length; i++) {
        if (this.tareas.productos[i].nombre.toLowerCase().indexOf( this.texto.toLowerCase(), 0 ) >= 0) {
            this.busquedaProd.push(this.tareas.productos[i]);
        }
      }
    } else {                      // la busqueda es por codigo de producto
      const codigo = this.texto.toString();
      if ( codigo.length <= environment.maxCharCodigoProd ){    // Busca por código de Producto Isleña
        const product = this.tareas.productos.find( e => e.id == this.texto );
        if ( product !== undefined ){
          this.busquedaProd.push(product);
        }
      } else {     // busca por código de barras
        const product = this.tareas.productos.find( e => e.codigoBarras == this.texto );
        if ( product !== undefined ){
          this.busquedaProd.push(product);
        }
      }
    }
    if (this.busquedaProd.length == 0){                    // no hay coincidencias
      this.tareas.presentAlertW( this.texto, 'No hay coincidencias' );
      this.texto = '';
      this.mostrarListaProd = false;
      // this.mostrarProducto = false;
    } else if (this.busquedaProd.length == 1){        // La coincidencia es exacta
      this.productoSelect(0);
    } else {
      this.mostrarListaProd = true;                // Se muestra el Arr busquedaProd con el subconjunto de productos
    }
  }

  productoSelect( i: number ){
    this.mostrarListaProd = false;             // Y se activa el flag de mostrar producto
    if ( i >= 0 ){
      this.busquedaProd[i].seleccionado = false;
      this.texto = this.busquedaProd[i].nombre;
      const j = this.existeEnDetalle(this.busquedaProd[i].id);
      if (j < 0){          // El Item NO había sido seleccionado anteriormente.
        this.agregarFaltante(this.busquedaProd[i]);
        this.sinSalvar = true;
      }
    } else {      // Se seleccionaron varios articulos
      for (let x = 0; x < this.busquedaProd.length; x++) {
        if ( this.existeEnDetalle(this.busquedaProd[x].id) < 0 ) {   // si el articulo no existe en el detalle se agrega
          this.agregarFaltante(this.busquedaProd[x]);
        }
        this.busquedaProd[x].seleccionado = false;
      }
      this.texto = '';
      this.mostrarListaProd = false;
      this.sinSalvar = true;
    }
    this.busquedaProd = [];
  }

  agregarFaltante( item: Productos ){
    const faltante = new DetalleVisita(item.id, item.nombre, item.codigoBarras, item.barrasCliente);
    this.tareas.rutero[this.i].detalle.unshift(faltante);
  }

  existeEnDetalle( id: string ){
    if ( this.tareas.rutero[this.i].detalle.length !== 0 ){
      const j = this.tareas.rutero[this.i].detalle.findIndex( data => data.idProducto === id );
      return j;
    } else {
      return -1;
    }
  }

  cambioStock( i: number ){
    if ( this.tareas.rutero[this.i].detalle[i].stock === 0 ){
      this.tareas.rutero[this.i].detalle[i].stock = 1;
      this.tareas.rutero[this.i].detalle[i].imagen = environment.bajoStock;
    } else if (this.tareas.rutero[this.i].detalle[i].stock === 1){
      this.tareas.rutero[this.i].detalle[i].stock = -1;
      this.tareas.rutero[this.i].detalle[i].imagen = environment.faltante;
    } else {
      this.tareas.rutero[this.i].detalle[i].stock = 0;
      this.tareas.rutero[this.i].detalle[i].imagen = environment.okStock;
    }
  }

  async presentAlertSalir() {
    const alert = await this.alertCtl.create({
      cssClass: 'my-custom-class',
      header: 'Cuidado!!!',
      message: 'Desea terminar la tarea.  Se perdera la informacion no salvada.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Si',
          handler: () => {
            this.modalCtrl.dismiss({check: false});
          }
        }
      ]
    });
    await alert.present();
  }

  seguir(){
    this.modalCtrl.dismiss({check: true});
  }

}
