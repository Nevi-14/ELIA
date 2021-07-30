import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { PDV } from 'src/app/models/pdv';
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
  etiqueta:   string = 'Bodega - Con Stock';
  linea:      number = 0;
  lineas:     number = 0;

  constructor( private alertCtrl: AlertController,
               private modalCtrl: ModalController,
               private tareas: TareasService,
               private bd: EliaService,
               private popoverCtrl: PopoverController ) {}

  ngOnInit() {
    this.nombrePDV = this.pdv.nombre;
    this.detalleRut = this.tareas.rutero[this.i].detalle.filter( d => d.existencias > 0 );
    if ( this.detalleRut.length === 0 ){
      this.justificar = true;
      this.etiqueta = 'Bodega Final';
      this.detalleRut = this.tareas.rutero[this.i].detalle.slice(0);
    }
    this.lineas = this.detalleRut.length;
    console.log('Faltantes con Stock: ', this.detalleRut);
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

  cambioStock( i: number ){
    if ( this.detalleRut[i].stock === 0 ){
      this.detalleRut[i].stock = 1;
      this.detalleRut[i].imagen = environment.bajoStock;
    } else if (this.detalleRut[i].stock === 1){
      this.detalleRut[i].stock = -1;
      this.detalleRut[i].imagen = environment.faltante;
    } else {
      this.detalleRut[i].stock = 0;
      this.detalleRut[i].imagen = environment.okStock;
      this.linea += 1;
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
    this.tareas.rutero[this.i].detalle = this.detalleRut.slice(0);
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
