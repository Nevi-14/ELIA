import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TareasService } from 'src/app/services/tareas.service';
import { BodegaPage } from '../bodega/bodega.page';
import { CheckinPage } from '../checkin/checkin.page';
import { FaltantesPage } from '../faltantes/faltantes.page';
import { ResumenPage } from '../resumen/resumen.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  hora: Date = new Date();

  constructor( private modalCtrl: ModalController,
               private tareas: TareasService,
               private geolocation: Geolocation ) {
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
        if (this.tareas.rutero[i].checkIn == null || this.tareas.rutero[i].checkBodega == null){
          this.geolocation.getCurrentPosition().then((resp) => {
            this.tareas.rutero[i].latitud = resp.coords.latitude;
            this.tareas.rutero[i].longitud = resp.coords.longitude;
            this.abrirFaltantes( i );
           }).catch((error) => {
             console.log('Error getting location', error);
             this.abrirFaltantes( i );
           });
        } else {
          this.abrirBodega( i );
        }
      }
    } else {
      this.abrirResumen( i );
    }
  }

  async abrirFaltantes( i: number ){
    this.tareas.pdvActivo = this.tareas.pdvs.find(d => d.id === this.tareas.rutero[i].idPDV);
    if ( this.tareas.rutero[i].checkIn === null ){ 
      this.tareas.rutero[i].checkIn = new Date();
      this.tareas.guardarVisitas();
      // cargar visita anterior.
      this.tareas.cargarVisitaAnterior( this.tareas.rutero[i].idPDV, i);
    }

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
    this.tareas.rutero[i].checkBodega = new Date();
    this.tareas.guardarVisitas();
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
      return;
    }
  }

  async abrirResumen( i: number ){
    const modal4 = await this.modalCtrl.create({
      component: ResumenPage,
      componentProps: {
        'pdv': this.tareas.pdvs[i],
        'i': i,
      },
      cssClass: 'my-custom-class'
    });
    await modal4.present();
    const {data} = await modal4.onDidDismiss();
    if ( data.check ){
      return;
    }
  }

  getGeo(){
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

}
