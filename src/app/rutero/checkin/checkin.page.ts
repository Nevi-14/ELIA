import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PDV } from 'src/app/models/pdv';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { EliaService } from '../../services/elia.service';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.page.html',
  styleUrls: ['./checkin.page.scss'],
})
export class CheckinPage {

  @Input() pdv: PDV;
  sinMarcas: boolean = false;

  constructor( private elia: EliaService,
               private modalCtrl: ModalController,
               private geolocation: Geolocation ) { }

  checkIn(){
    this.elia.presentaLoading('Espere por favor');
    this.geolocation.getCurrentPosition(/*{enableHighAccuracy: true, timeout: 8000, maximumAge: 0}*/).then(
      resp => {
        this.elia.loadingDissmiss();
        const latitud = resp.coords.latitude;
        const longitud = resp.coords.longitude;
        this.modalCtrl.dismiss({check: true, latitud, longitud, sinMarcas: this.sinMarcas});
     }).catch((error) => {
      this.elia.loadingDissmiss();
      console.log('Error getting location', error);
      this.modalCtrl.dismiss({check: true, latitud: 0, longitud: 0, sinMarcas: this.sinMarcas});
     });
  }

  regresar(){
    this.modalCtrl.dismiss({check: false});
  }

}
