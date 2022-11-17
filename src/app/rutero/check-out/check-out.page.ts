import { Component, Input, ViewChild } from '@angular/core';
import { PDV } from '../../models/pdv';
import { IonList, ModalController, AlertController } from '@ionic/angular';
import { Articulos, Productos } from 'src/app/models/productos';
import { EliaService } from '../../services/elia.service';
import { environment } from 'src/environments/environment';
import { TareasService } from '../../services/tareas.service';
import { DetalleVisita } from 'src/app/models/rutero';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.page.html',
  styleUrls: ['./check-out.page.scss'],
})
export class CheckOutPage {

  @Input() pdv: PDV;
  @Input() i: number;
  hayMarcas = false;
  mostrarListaProd = false;
  etiqueta = 'Sin Marcas'
  lineas = 0;
  texto = '';
  productos: Productos[] = [];
  articulos: Articulos[] = [];
  busquedaProd: Productos[] = [];

  @ViewChild('myList') ionList: IonList;

  constructor( private elia: EliaService,
               private tareas: TareasService,
               private bd: EliaService,
               private modalCtrl: ModalController,
               private alertCtl: AlertController,
               private barcodeScanner: BarcodeScanner ) { }

  async cargarProductos( idCliente: string ){
    let prod: Productos[] = [];

    prod = await this.elia.cargarProductos();
    this.productos = prod.filter( d => d.idCliente === idCliente );
    console.log( this.productos );
  }

  async cargarArticulos(){
    this.articulos = await this.elia.cargarArticulos();
    console.log( this.articulos );
  }

  
  hacerMarcas(){
    this.hayMarcas = true;
    this.etiqueta = '* Marcas *';
    this.cargarProductos( this.pdv.idWM );
    this.cargarArticulos();
  }

  buscarProducto(){ 
    if (this.texto.length > 0){
      if (isNaN(+this.texto)) {            // Se buscará por nombre de producto
        // Se recorre el arreglo para buscar coincidencias y se llena el arreglo busquedaProd[]
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
      if (this.busquedaProd.length === 0){                    // no hay coincidencias en la busqueda
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
          const i = this.articulos.findIndex( d => d.codigO_BARRAS_VENT === barras );     // i > 0 significa que el artículo está en la lista de Isleña
          if ( i >= 0 ){
            const j = this.productos.findIndex( d => d.idIslena === this.articulos[i].articulo );
            if ( j >= 0 ){                                                               // j > 0 significa que el artículo está en el catálogo de la tienda
              this.busquedaProd.push( this.productos[j] );
              this.texto = ''; 
            } else {
              // Se incluirá el artçiculo en la lista de la tienda
              const prod = new Productos( this.articulos[i].articulo, this.pdv.id, this.articulos[i].articulo, this.articulos[i].descripcion, 0, this.articulos[i].codigO_BARRAS_VENT,
                              this.articulos[i].codigO_BARRAS_VENT, -1);
              this.busquedaProd.push( prod );
              this.tareas.presentAlertW('Scan', 'Producto no existe en lista de la tienda. Será incluido... ' + barras);
              this.texto = '';  
            }
          } else {
            this.tareas.presentAlertW('Scan', 'Producto no existe en lista de Isleña: ' + barras);
            this.texto = '';
          }
          
          if ( this.busquedaProd.length > 0 ){
            this.busquedaProd[0].codigoBarras = barras;
            this.busquedaProd[0].barrasCliente = barras;
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

  listaProducClick( i: number ){ 
    if (environment.prdMode){
      this.mostrarListaProd = false;             // Y se activa el flag de mostrar producto
      this.busquedaProd = [];
    } else {
      this.productoSelect(i);
    }
  }

  agregarDetalle( item: Productos ){ //debugger
    const faltante = new DetalleVisita(item.id, item.nombre, item.codigoBarras, item.barrasCliente, 0, -1, false, environment.faltante);
    this.tareas.rutero[this.i].detalle.unshift(faltante);
    this.lineas += 1;
  }

  existeEnDetalle( id: string ){
    
    if ( this.tareas.rutero[this.i].detalle.length !== 0 ){
      const j = this.tareas.rutero[this.i].detalle.findIndex( data => data.idProducto === id );
      return j;
    } else {
      return -1;
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
            } else {
              this.tareas.presentAlertW('El vencimiento', 'La cantidad no puede ser 0...!!!');
              data.vencimiento = '';
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

  cambioStock( i: number ){
    if ( this.tareas.rutero[this.i].detalle[i].stock === 0 ){
      this.tareas.rutero[this.i].detalle[i].stock = 1;
      this.tareas.rutero[this.i].detalle[i].imagen = environment.bajoStock;
      this.tareas.rutero[this.i].detalle[i].justificacion = null;
    } else if (this.tareas.rutero[this.i].detalle[i].stock === 1){
      this.tareas.rutero[this.i].detalle[i].stock = -1;
      this.tareas.rutero[this.i].detalle[i].imagen = environment.faltante;
      this.tareas.rutero[this.i].detalle[i].justificacion = null;
    } else {
      this.tareas.rutero[this.i].detalle[i].stock = 0;
      this.tareas.rutero[this.i].detalle[i].imagen = environment.okStock;
      this.tareas.rutero[this.i].detalle[i].justificacion = 'N/A';
    }
  }

  async checkOut(){
    const alert = await this.alertCtl.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: 'Check Out',
      message: 'Desea realizar el Check Out?',
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
          handler: () => { //debugger
            this.modalCtrl.dismiss({check: true});
          }
        }
      ]
    });
    await alert.present();
  }

  regresar(){
    this.modalCtrl.dismiss({check: false});
  }

}
