import { Component, Input, OnInit } from '@angular/core';
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
export class FaltantesPage implements OnInit {

  @Input() pdv: PDV;
  @Input() i: number;

  productos: Productos[] = [];                          // Lista de articulos del punto de venta
  nombrePDV: string = '';                              // Nombre del Punto de Venta
  texto: string;                                      // texto de busqueda
  mostrarListaProd: boolean = false;                 // True = Se debe mostrar la lista de productos a buscar
  sinSalvar: boolean = false;                       // Indica si hay líneas sin salvar
  busquedaProd: Productos[] = [];                  // Arreglo que contiene la coincidencias de la busqueda. Este arreglo se despliega si mostrarListaProd = true
  linea: number = 0;                              // Número de lineas ingresadas
  lineas: number = 0;                            // Número de líneas a ingresar
  completo: boolean = false;                    // True cuando se completaron la totalidad de líneas ingresadas en el detalle del rutero

  constructor( private modalCtrl: ModalController,
               private tareas: TareasService,
               private alertCtl: AlertController ) {}

  ngOnInit() {
    this.nombrePDV = this.pdv.nombre;
    this.productos = SKUS.slice(0);
    this.linea = this.tareas.rutero[this.i].detalle.length;
    this.lineas = this.productos.length;
  }

  /*buscarProducto(){
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
  }*/

  buscarProducto(){
    if (this.texto.length > 0){
      if (isNaN(+this.texto)) {            // Se buscará por código de producto
        // Se recorre el arreglo para buscar coincidencias
        for (let i = 0; i < this.productos.length; i++) {
          if (this.productos[i].nombre.toLowerCase().indexOf( this.texto.toLowerCase(), 0 ) >= 0) {
              this.busquedaProd.push(this.productos[i]);
          }
        }
      } else {                      // la busqueda es por codigo de producto
        const codigo = this.texto.toString();
        if ( codigo.length <= environment.maxCharCodigoProd ){    // Busca por código de Producto Isleña
          const product = this.productos.find( e => e.id == this.texto );
          if ( product !== undefined ){
            this.busquedaProd.push(product);
          }
        } else {     // busca por código de barras
          const product = this.productos.find( e => e.codigoBarras == this.texto );
          if ( product !== undefined ){
            this.busquedaProd.push(product);
          }
        }
      }
      if (this.busquedaProd.length === 0){                    // no hay coincidencias
        this.tareas.presentAlertW( this.texto, 'No hay coincidencias' );
        this.texto = '';
        this.mostrarListaProd = false;
      } else if (this.busquedaProd.length === 1){        // La coincidencia es exacta
        this.productoSelect(0);
      } else {
        this.mostrarListaProd = true;                // Se muestra el Arr busquedaProd con el subconjunto de productos
      }
    } else {
      this.mostrarListaProd = false;
    }
  }

  productoSelect( i: number ){
    this.mostrarListaProd = false;             // Y se activa el flag de mostrar producto
    if ( i >= 0 ){
      this.busquedaProd[i].seleccionado = false;
      this.texto = '';
      const j = this.existeEnDetalle(this.busquedaProd[i].id);
      if (j < 0){          // El Item NO había sido seleccionado anteriormente.
        this.agregarDetalle(this.busquedaProd[i]);
      }
    } /* else {      // Se seleccionaron varios articulos
      for (let x = 0; x < this.busquedaProd.length; x++) {
        if ( this.existeEnDetalle(this.busquedaProd[x].id) < 0 ) {   // si el articulo no existe en el detalle se agrega
          this.agregarFaltante(this.busquedaProd[x]);
        }
        this.busquedaProd[x].seleccionado = false;
      }
      this.texto = '';
      this.mostrarListaProd = false;
      this.sinSalvar = true;
    } */
    this.busquedaProd = [];
  }

  agregarDetalle( item: Productos ){
    const faltante = new DetalleVisita(item.id, item.nombre, item.codigoBarras, item.barrasCliente);
    this.tareas.rutero[this.i].detalle.unshift(faltante);
    this.linea += 1;
    if (this.linea === this.lineas){
      this.completo = true;
    }
    this.sinSalvar = true;
  }

  existeEnDetalle( id: string ){
    if ( this.tareas.rutero[this.i].detalle.length !== 0 ){
      const j = this.tareas.rutero[this.i].detalle.findIndex( data => data.idProducto === id );
      return j;
    } else {
      return -1;
    }
  }

  salvar(){
    if (this.sinSalvar){
      this.tareas.guardarVisitas();
      this.sinSalvar = false;
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
      message: 'Desea terminar la tarea.  Se puede perder la informacion no salvada.',
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
