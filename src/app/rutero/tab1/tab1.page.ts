import { Component } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { TareasService } from 'src/app/services/tareas.service';
import { BodegaPage } from '../bodega/bodega.page';
import { CheckinPage } from '../checkin/checkin.page';
import { FaltantesPage } from '../faltantes/faltantes.page';
import { ResumenPage } from '../resumen/resumen.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { EliaService } from 'src/app/services/elia.service';
import { AlmuerzoPage } from '../almuerzo/almuerzo.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  hora: Date = new Date();
  loading: HTMLIonLoadingElement;

  constructor( private modalCtrl: ModalController,
               private tareas: TareasService,
               private elia: EliaService,
               private bd: EliaService,
               private geolocation: Geolocation,
               private alertCtrl: AlertController,
               private loadingCtrl: LoadingController ) {
    this.tareas.cargarClientes();
    this.tareas.cargarRutero();
    if (this.tareas.varConfig.almuerzoTime){
      console.log('Estamos en hora de almuerzo');
      this.activarAlmuerzo();
    }
  }

  async checkIn( i: number ){
    console.log(i);
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
        this.tareas.pdvActivo = this.tareas.pdvs.find(d => d.id === this.tareas.rutero[i].idPDV);
        if (this.tareas.rutero[i].checkIn == null || this.tareas.rutero[i].checkBodega == null){
          this.presentaLoading( 'Check In...');
          this.geolocation.getCurrentPosition().then((resp) => {
            this.tareas.rutero[i].latitud = resp.coords.latitude;
            this.tareas.rutero[i].longitud = resp.coords.longitude;
            this.tareas.presentAlertW('Geo Location', resp.coords.latitude + ' ' + resp.coords.longitude);
            this.abrirFaltantes( i );
           }).catch((error) => {
             console.log('Error getting location', error);
             this.abrirFaltantes( i );
           });
           //this.abrirFaltantes( i );
        } else {
          this.abrirBodega( i );
        }
      }
    } else {
      this.abrirResumen( i );
    }
  }

  async horaAlmuerzo(){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Hora de Almuerzo',
      message: 'Favor Confirmar que estará tomando a partir de este momento, su hora de almuerzo.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            console.log('Confirm Okay');
            this.activarAlmuerzo();
          }
        }
      ]
    });
    await alert.present();
  }

  async activarAlmuerzo(){
    if (!this.tareas.varConfig.almuerzoTime){
      this.tareas.varConfig.horaAlmuerzo = new Date();
      this.tareas.varConfig.almuerzoTime = true;
      this.tareas.guardarVarConfig();
      this.elia.updateVisitas( this.tareas.varConfig );
    }
    const modal = await this.modalCtrl.create({
      component: AlmuerzoPage,
      componentProps: {
        'crono': 60
      },
      cssClass: 'my-custom-class'
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    
  }

  async abrirFaltantes( i: number ){
    if ( this.tareas.rutero[i].checkIn === null ){ 
      this.tareas.rutero[i].checkIn = new Date();
      // cargar visita anterior.
      this.tareas.cargarVisitaAnterior( this.tareas.rutero[i].idPDV, i);
      this.bd.insertRutero( this.tareas.rutero[i] );
      this.tareas.guardarVisitas();
    }
    const modal2 = await this.modalCtrl.create({
      component: FaltantesPage,
      componentProps: {
        'pdv': this.tareas.pdvActivo,
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
    const temp = this.tareas.rutero[i].detalle.filter( d => d.stock !== 0 || d.vencimiento !== null );
    this.tareas.rutero[i].detalle = temp.slice(0);
    this.tareas.rutero[i].checkBodega = new Date();
    this.tareas.guardarVisitas();
    const modal3 = await this.modalCtrl.create({
      component: BodegaPage,
      componentProps: {
        'pdv': this.tareas.pdvActivo,
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
    this.tareas.pdvActivo = this.tareas.pdvs.find(d => d.id === this.tareas.rutero[i].idPDV);
    const modal4 = await this.modalCtrl.create({
      component: ResumenPage,
      componentProps: {
        'pdv': this.tareas.pdvActivo,
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

  async presentaLoading( message: string ){
    this.loading = await this.loadingCtrl.create({
      message,
      duration: 3000,
    });
    await this.loading.present();
  }

  loadingDissmiss(){
    this.loading.dismiss();
  }

}
