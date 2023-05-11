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
import { CheckOutPage } from '../check-out/check-out.page';
import { VisitaDiaria } from 'src/app/models/rutero';
import { RespuestasEncuestasService } from 'src/app/services/respuestas-encuestas.service';

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
               private loadingCtrl: LoadingController,
               public respuestasEncuestasService:RespuestasEncuestasService
                ) {
    this.tareas.cargarClientes();
    this.tareas.cargarRutero();
    if (this.tareas.varConfig.almuerzoTime){
      console.log('Estamos en hora de almuerzo');
      this.activarAlmuerzo();
    }
  }



  async checkIn( i: number , visita:VisitaDiaria ){
    this.respuestasEncuestasService.visita = visita;
    console.log(i);
    this.tareas.pdvActivo = this.tareas.pdvs.find(d => d.id === this.tareas.rutero[i].idPDV);
    if (!this.tareas.varConfig.almuerzoTime) {             // Sino es tiempo de almuerzo activado
      if (!this.tareas.rutero[i].visitado){               // Validamos si el cliente ya fue visita
        if ( this.tareas.rutero[i].checkIn === null ){   // Validamos si NO se hizo check in en el cliente para invocar el check in
          const modal = await this.modalCtrl.create({
            component: CheckinPage,
            mode: 'ios',
            initialBreakpoint: 0.55,
            breakpoints: [0, 0.25, 0.5, 0.75],
            componentProps: {
              'pdv': this.tareas.rutero[i]
            },
            cssClass: 'my-custom-class'
          });
          await modal.present();
          const {data} = await modal.onDidDismiss();
          if ( data.check ){
            //this.tareas.presentAlertW('Geo Location', data.latitud + ' ' + data.longitud);
            this.tareas.rutero[i].latitud = data.latitud;
            this.tareas.rutero[i].longitud = data.longitud;
            this.tareas.rutero[i].sinMarcas = data.sinMarcas;
            if ( !data.sinMarcas ){
              this.abrirFaltantes(i);
            } else {
              this.abrirCheckOut(i);
            }
          }
        } else if ( this.tareas.rutero[i].checkIn !== null && this.tareas.rutero[i].checkBodega === null ){
          if ( !this.tareas.rutero[i].sinMarcas ){
            this.abrirFaltantes(i);
          } else {
            this.abrirCheckOut(i);
          }
        } else if ( this.tareas.rutero[i].checkBodega !== null ){
          this.abrirBodega(i);
        }
      } else {
        this.abrirResumen(i);
      }
    } else {
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

  async abrirCheckOut( i: number ){
    if ( this.tareas.rutero[i].checkIn === null ){ 
      this.tareas.rutero[i].checkIn = new Date();
      this.bd.insertRutero( this.tareas.rutero[i] );
      this.tareas.guardarVisitas();
    }
    const modal4 = await this.modalCtrl.create({
      component: CheckOutPage,
      componentProps: {
        'pdv': this.tareas.pdvActivo,
        'i': i,
      },
      cssClass: 'my-custom-class'
    });
    await modal4.present();
    const {data} = await modal4.onDidDismiss();
    if ( data.check ){
      this.tareas.rutero[i].checkOut = new Date();
      this.tareas.rutero[i].visitado = true;
      this.tareas.rutero[i].observaciones = 'SIN MARCAS...!!!';
      this.tareas.guardarVisitas();
      this.bd.updateRutero( this.tareas.rutero[i] );
    }
  }

  async abrirBodega( i: number ){
    //const temp = this.tareas.rutero[i].detalle.filter( d => d.stock !== 0 || d.vencimiento !== null );
    //this.tareas.rutero[i].detalle = temp.slice(0);
    if (this.tareas.rutero[i].checkBodega === null){
      this.tareas.rutero[i].checkBodega = new Date();
      this.tareas.guardarVisitas();
    }
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
