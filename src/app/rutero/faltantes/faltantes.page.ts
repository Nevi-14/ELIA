import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonList, ModalController, PopoverController } from '@ionic/angular';
import { PDV } from 'src/app/models/pdv';
import { Articulos, Productos } from 'src/app/models/productos';
import { DetalleVisita } from 'src/app/models/rutero';
import { TareasService } from 'src/app/services/tareas.service';
import { environment } from 'src/environments/environment';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PenArrayPage } from '../pen-array/pen-array.page';
import { EliaService } from 'src/app/services/elia.service';

@Component({
  selector: 'app-faltantes',
  templateUrl: './faltantes.page.html',
  styleUrls: ['./faltantes.page.scss'],
})
export class FaltantesPage implements OnInit {

  @Input() pdv: PDV;
  @Input() i: number;

  productos: Productos[] = [];                          // Lista de articulos del punto de venta en Mercaderistas
  articulos: Articulos[] = [];                          // Lista de articulos de islena en Softland
  nombrePDV: string = '';                              // Nombre del Punto de Venta
  texto: string = '';                                      // texto de busqueda
  mostrarListaProd: boolean = false;                 // True = Se debe mostrar la lista de productos a buscar
  sinSalvar: boolean = false;                       // Indica si hay líneas sin salvar
  busquedaProd: Productos[] = [];                  // Arreglo que contiene la coincidencias de la busqueda. Este arreglo se despliega si mostrarListaProd = true
  linea: number = 0;                              // Número de lineas ingresadas
  lineas: number = 0;                            // Número de líneas a ingresar
  completo: boolean = false;                    // True cuando se completaron la totalidad de líneas ingresadas en el detalle del rutero

  @ViewChild('myList') ionList: IonList;

  constructor( private modalCtrl: ModalController,
               private tareas: TareasService,
               private elia: EliaService,
               private alertCtl: AlertController,
               private barcodeScanner: BarcodeScanner,
               private popoverCtrl: PopoverController ) {}

  ngOnInit() {
    this.nombrePDV = this.pdv.nombre;
    this.cargarProductos( this.pdv.idWM );
    this.cargarArticulos();
    this.linea = this.tareas.rutero[this.i].detalle.length;
    this.lineas = this.productos.length;
  }

  async cargarProductos( idCliente: string ){
    let prod: Productos[] = [];

    prod = await this.elia.cargarProductos();
    this.productos = prod.filter( d => d.idCliente === idCliente );
    console.log( this.productos );
    if (this.productos.length > 0){
      this.lineas = this.productos.length;
    }
  }

  async cargarArticulos(){
    this.articulos = await this.elia.cargarArticulos();
    console.log( this.articulos );
  }

  buscarProducto(){

    if (this.texto.length > 0){
      if (isNaN(+this.texto)) {            // Se buscará por nombre de producto
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
    } else {                           // Se abre el lector de códigos de barras
      this.mostrarListaProd = false;
      this.busquedaProd = [];
      let barras: string = '';
      this.barcodeScanner.scan().then(barcodeData => {
        console.log('Barcode data', barcodeData);
        if ( !barcodeData.cancelled ){
          barras = barcodeData.text;
          // const item = this.productos.find( d => d.codigoBarras === texto );

          const i = this.articulos.findIndex( d => d.codigO_BARRAS_VENT === barras );
          if ( i >= 0 ){
            const j = this.productos.findIndex( d => d.idIslena === this.articulos[i].articulo );
            if ( j >= 0 ){
              this.busquedaProd.push( this.productos[j] );
            } else {
              this.tareas.presentAlertW('Scan', 'Producto no existe en lista de la tienda: ' + barras);
              this.texto = '';
            }
          } else {
            this.tareas.presentAlertW('Scan', 'Producto no existe en lista de Isleña: ' + barras);
            this.texto = '';
          }
          if ( this.busquedaProd.length > 0 ){
            this.productoSelect(0);
          }
        }
       }).catch(err => {
           console.log('Error', err);
           this.tareas.presentAlertW('Scan', 'Error al abrir el Scaner');
       });
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
    } 
    this.busquedaProd = [];
  }

  agregarDetalle( item: Productos ){
    const faltante = new DetalleVisita(item.id, item.nombre, item.codigoBarras, item.barrasCliente, item.stock);
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

  cargarFaltantes(){
    let item: DetalleVisita;
    let existe: number;

    this.productos.forEach( d => {
      existe = this.tareas.rutero[this.i].detalle.findIndex( e => e.idProducto === d.id );
      if ( existe < 0 ){
        item = new DetalleVisita( d.id, d.nombre, d.codigoBarras, d.barrasCliente, d.stock, -1, false, environment.faltante );
        this.tareas.rutero[this.i].detalle.push( item );
      }
    });
  }

  async presentAlert( texto: string, tipo: string ) {
    const alert = await this.alertCtl.create({
      cssClass: 'my-custom-class',
      header: 'Alto',
      message: texto,
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
            if (tipo === 'Salir'){
              this.modalCtrl.dismiss({check: false});
            } else if ( tipo === 'Bodega') {
              this.cargarFaltantes();
              this.tareas.guardarVisitas();
              this.modalCtrl.dismiss({check: true});
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async pendientes(ev: any){
    let penArray: Productos[] = [];
    let existe: number;

    this.productos.forEach( d => {
      existe = this.tareas.rutero[this.i].detalle.findIndex( e => e.idProducto === d.id );
      if ( existe < 0 ){
        penArray.push( d );
      }
    });
    if ( penArray.length > 0 ){
      const popover = await this.popoverCtrl.create({
        component: PenArrayPage,
        componentProps: {
          'pendientes': penArray
        },
        cssClass: 'my-custom-class',
        event: ev,
        translucent: true
      });
      await popover.present();
    }
  }

  async vencimientos( j: number ){
    const alert = await this.alertCtl.create({
      cssClass: 'my-custom-class',
      header: 'Vecimientos',
      message: this.tareas.rutero[this.i].detalle[j].nombre,
      inputs: [
        {
          name: 'vencimiento',
          value: this.tareas.rutero[this.i].detalle[j].vencimiento,
          id: 'vencimiento',
          type: 'date'
        },
        {
          name: 'cantidad',
          value: this.tareas.rutero[this.i].detalle[j].cant_Vence,
          id: 'cantidad',
          type: 'number'
        }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
            this.ionList.closeSlidingItems();
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            if ( data.cantidad !== '' ){
              this.tareas.rutero[this.i].detalle[j].cant_Vence = +data.cantidad;
            }
            if ( data.vencimiento !== '' ){
              this.tareas.rutero[this.i].detalle[j].vencimiento = new Date(data.vencimiento);
            }
            console.log(this.tareas.rutero[this.i].detalle[j]);
            this.ionList.closeSlidingItems();
          }
        }
      ]
    });
    await alert.present();
    
  }

}
