import { Component, Input } from '@angular/core';
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
export class BodegaPage {

  @Input() pdv: PDV;
  @Input() i: number;

  nombrePDV: string = '';

  constructor( private alertCtrl: AlertController,
               private modalCtrl: ModalController,
               private tareas: TareasService,
               private popoverCtrl: PopoverController ) {

    this.nombrePDV = this.tareas.pdvActivo.nombre;
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

  async transito(ev: any){
    const popover = await this.popoverCtrl.create({
      component: TransitoPage,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  seguir(){
    const temp = this.tareas.rutero[this.i].detalle.filter( d => d.stock !== 0 );
    this.tareas.rutero[this.i].detalle = temp.slice(0);
    this.tareas.guardarFaltantes();
  }

}
