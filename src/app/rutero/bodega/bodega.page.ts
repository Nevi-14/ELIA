import { Component, Input, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController, ModalController, Platform, PopoverController } from '@ionic/angular';
import { PDV } from 'src/app/models/pdv';
import { Articulos, Productos } from 'src/app/models/productos';
import { DetalleVisita } from 'src/app/models/rutero';
import { EliaService } from 'src/app/services/elia.service';
import { TareasService } from 'src/app/services/tareas.service';
import { environment } from 'src/environments/environment';
import { TransitoPage } from '../transito/transito.page';

@Component({
  selector: 'app-bodega',
  templateUrl: './bodega.page.html',
  styleUrls: ['./bodega.page.scss'],
})
export class BodegaPage implements OnInit {

  @Input() pdv: PDV;
  @Input() i: number;

  nombrePDV: string = '';
  justificar: boolean = false;       // true = si ya se terminó de modificar estados y es hora de justificar faltantes
  pendientes: number = 0;           // El número de faltantes que están pendientes de justificar
  detalleRut: DetalleVisita[] = [];
  articulos:  Articulos[] = [];
  productos: Productos[] = [];
  etiqueta:   string = 'Bodega - Con Stock';
  linea:      number = 0;
  lineas:     number = 0;

  constructor( private alertCtrl: AlertController,
               private modalCtrl: ModalController,
               private tareas: TareasService,
               private bd: EliaService,
               private plt: Platform,
               private barcodeScanner: BarcodeScanner,
               private popoverCtrl: PopoverController ) {}

  ngOnInit() {
    this.nombrePDV = this.pdv.nombre;
    this.cargarArticulos();
    this.cargarProductos(this.pdv.idWM);
    this.detalleRut = this.tareas.rutero[this.i].detalle.filter( d => d.existencias > 0 );
    if ( this.detalleRut.length === 0 ){
      this.justificar = true;
      this.etiqueta = 'Bodega Final';
      this.detalleRut = this.tareas.rutero[this.i].detalle.slice(0);
    }
    this.lineas = this.detalleRut.length;
    console.log('Faltantes con Stock: ', this.detalleRut);
  }

  async cargarArticulos(){
    this.articulos = await this.bd.cargarArticulos();
    console.log( this.articulos );
  }

  async cargarProductos( idCliente: string ){
    let prod: Productos[] = [];

    prod = await this.bd.cargarProductos();
    this.productos = prod.filter( d => d.idCliente === idCliente );
    console.log( 'Productos:', this.productos );
    if (this.productos.length > 0){
      this.lineas = this.productos.length;
    }
  }

  async presentAlertSalir() {
    const alert = await this.alertCtrl.create({
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

  async cambioStock( i: number ){
    if ( this.plt.is('capacitor')) {                      // Si se ejecuta desde el celular abre el scaner, sino un alert input
      this.barcodeScanner.scan().then(barcodeData => {
        console.log('Barcode data', barcodeData);
        if ( !barcodeData.cancelled ){
          this.procesaCambio( barcodeData.text )
        }
       }).catch(err => {
           console.log('Error', err);
           this.tareas.presentAlertW('Scan', 'Error al abrir el Scaner');
      });
    } else {                                           // Al ejecutarse desde un emulador abre el alert input para leer el código de barras
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Digite el código:',
        inputs: [
          {
            name: 'barras',
            type: 'number',
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (data) => {
              console.log(data.barras);
              this.procesaCambio( data.barras );
            }
          }
        ]
      });
      await alert.present();
    }
  }

  procesaCambio( codigo: string ){ //debugger
    const a = this.articulos.findIndex( d => d.codigO_BARRAS_VENT === codigo );
    if ( a >= 0 ){
      const b = this.productos.findIndex( e => e.idIslena === this.articulos[a].articulo );
      if ( b >= 0 ){
        const c = this.detalleRut.findIndex( g => g.idProducto === this.productos[b].id );
        if ( c >= 0 ){
          if ( this.detalleRut[c].stock !== 0 ){
            this.linea += 1;
          }
          this.detalleRut[c].stock = 0;
          this.detalleRut[c].imagen = environment.okStock;
          this.tareas.presentAlertW('Scan', 'Ok... ');
        } else {
          this.tareas.presentAlertW('Scan', 'Producto no existe en la lista de pendientes: ' + codigo);
        }
      } else {   // El artículo no está en la lista de productos de la tienda.  Puede ser que se ingresara directo del catalogo de Isleña.  Entonces se busca por codigo de barras
        const d = this.detalleRut.findIndex( g => g.codBarras === codigo );
        if ( d >= 0 ){
          if ( this.detalleRut[d].stock !== 0 ){
            this.linea += 1;
          }
          this.detalleRut[d].stock = 0;
          this.detalleRut[d].imagen = environment.okStock;
          this.tareas.presentAlertW('Scan', 'Ok... ');
        } else {
          this.tareas.presentAlertW('Scan', 'Producto no existe en la lista de la tienda: ' + codigo);
        }
      }
    } else {
      this.tareas.presentAlertW('Scan', 'Producto no existe en la lista de Isleña: ' + codigo);
    }
  }

  async transito(ev: any, j: number ){
    console.log(this.detalleRut[j]);
    const popover = await this.popoverCtrl.create({
      component: TransitoPage,
      componentProps: {
        'stock': this.detalleRut[j].stock,
        'faltante': this.detalleRut[j].justificacion,
        'SKU': this.detalleRut[j].nombre,
        'inventario': this.detalleRut[j].existencias,
        'cliente': this.pdv.idWM,
        'vencimiento': this.detalleRut[j].vencimiento,
        'cant_Vence': this.detalleRut[j].cant_Vence
      },
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
    if ( data !== undefined ){
      if ( this.detalleRut[j].justificacion === null ){
        this.linea += 1;
      }
      this.detalleRut[j].justificacion = data.nota;
    }
  }

  salvar(){
    if ( !this.justificar ){
      let j: number = 0;

      this.justificar = true;

      // Actualizar Rutero.Detalle con el temporal detalleRut

      this.detalleRut.forEach( d => {
        j = this.tareas.rutero[this.i].detalle.findIndex( e => e.idProducto === d.idProducto );
        this.tareas.rutero[this.i].detalle[j] = d;
      });
      const temp = this.tareas.rutero[this.i].detalle.filter( d => d.stock !== 0 );
      this.tareas.rutero[this.i].detalle = temp.slice(0);
      this.tareas.guardarVisitas();
      this.detalleRut = this.tareas.rutero[this.i].detalle.slice(0);
      this.etiqueta = 'Bodega Final';
    } else {
      this.checkOut();
    }
  }

  checkOut(){
    const temp = this.tareas.rutero[this.i].detalle.filter( d => d.stock !== 0 );
    this.tareas.rutero[this.i].detalle = temp.slice(0);
    const existe = this.tareas.rutero[this.i].detalle.findIndex( d => d.stock === -1 && d.justificacion === null );

    if ( existe < 0) {
      this.tareas.rutero[this.i].checkOut = new Date();
      this.tareas.rutero[this.i].visitado = true;
      this.tareas.guardarVisitas();
      this.bd.updateRutero( this.tareas.rutero[this.i] );
      this.modalCtrl.dismiss({check: true});
    } else {
      this.tareas.presentAlertW( 'Faltantes', `Se debe justificar el faltante del artículo ${this.tareas.rutero[this.i].detalle[existe].idProducto}` );
    }
  }

}
