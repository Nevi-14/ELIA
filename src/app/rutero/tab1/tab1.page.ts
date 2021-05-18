import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TareasService } from 'src/app/services/tareas.service';
import { BodegaPage } from '../bodega/bodega.page';
import { CheckinPage } from '../checkin/checkin.page';
import { FaltantesPage } from '../faltantes/faltantes.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  hora: Date = new Date();

  constructor( private modalCtrl: ModalController,
               private tareas: TareasService ) {
    this.tareas.cargarRutero();
  }

  async checkIn( i: number ){
    if (!this.tareas.rutero[i].visitado){ 
      const modal = await this.modalCtrl.create({
        component: CheckinPage,
        componentProps: {
          'pdv': this.tareas.rutero[i]
        },
        cssClass: 'my-custom-class'
      });
      await modal.present();
      const {data} = await modal.onDidDismiss();
      if ( data.check ){
        this.abrirFaltantes( i );
        console.log('Haciendo Check In ', this.tareas.rutero[i].nombre);
      }
    } else {
      this.tareas.presentAlertW('Alto', 'Este cliente ya fue visitado');
    }
  }

  async abrirFaltantes( i: number ){
    this.tareas.pdvActivo = this.tareas.pdvs.find(d => d.id === this.tareas.rutero[i].idPDV);
    this.tareas.rutero[i].checkIn = new Date();

    // cargar visita anterior.
    this.tareas.cargarVisitaAnterior( this.tareas.rutero[i].idPDV, i);

    const modal2 = await this.modalCtrl.create({
      component: FaltantesPage,
      componentProps: {
        'pdv': this.tareas.pdvs[i],
        'i': i,
      },
      cssClass: 'my-custom-class'
    });
    await modal2.present();
    const {data} = await modal2.onDidDismiss();
    if ( data.check ){
      this.abrirBodega( i );
    }
  }

  async abrirBodega( i: number ){
    const temp = this.tareas.rutero[i].detalle.filter( d => d.stock !== 0 );
    this.tareas.rutero[i].detalle = temp.slice(0);
    const modal3 = await this.modalCtrl.create({
      component: BodegaPage,
      componentProps: {
        'pdv': this.tareas.pdvs[i],
        'i': i,
      },
      cssClass: 'my-custom-class'
    });
    await modal3.present();
    const {data} = await modal3.onDidDismiss();
    if ( data.check ){
      
    }
  }

}
