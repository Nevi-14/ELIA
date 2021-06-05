import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { PDV } from 'src/app/models/pdv';
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

  constructor( private alertCtrl: AlertController,
               private modalCtrl: ModalController,
               private tareas: TareasService,
               private popoverCtrl: PopoverController ) {}

  ngOnInit() {
    this.nombrePDV = this.pdv.nombre;
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

  async transito(ev: any, j: number ){
    const popover = await this.popoverCtrl.create({
      component: TransitoPage,
      componentProps: {
        'stock': this.tareas.rutero[this.i].detalle[j].stock,
        'faltante': this.tareas.rutero[this.i].detalle[j].justificacion
      },
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', data);
    if ( data !== undefined ){
      this.tareas.rutero[this.i].detalle[j].justificacion = data.nota;
    }
  }

  salvar(){
    if ( !this.justificar ){
      this.justificar = true;
      const temp = this.tareas.rutero[this.i].detalle.filter( d => d.stock !== 0 );
      this.tareas.rutero[this.i].detalle = temp.slice(0);
      this.tareas.guardarVisitas();
    } else {
      this.checkOut();
    }
  }

  checkOut(){
    const existe = this.tareas.rutero[this.i].detalle.findIndex( d => d.stock === -1 && d.justificacion === null );

    if ( existe < 0) {
      this.tareas.rutero[this.i].checkOut = new Date();
      this.tareas.rutero[this.i].visitado = true;
      this.tareas.guardarVisitas();
      this.modalCtrl.dismiss({check: true});
    } else {
      this.tareas.presentAlertW( 'Faltantes', `Se debe justificar el faltante del artículo ${this.tareas.rutero[this.i].detalle[existe].idProducto}` );
    }
  }

}
