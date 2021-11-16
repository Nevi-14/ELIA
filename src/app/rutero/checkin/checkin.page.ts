import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PDV } from 'src/app/models/pdv';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.page.html',
  styleUrls: ['./checkin.page.scss'],
})
export class CheckinPage {

  @Input() pdv: PDV;

  constructor( private modalCtrl: ModalController,
               private geolocation: Geolocation ) { }

  checkIn(){
    this.geolocation.getCurrentPosition({enableHighAccuracy: true, timeout: 5000, maximumAge: 0}).then(
      resp => {
      const latitud = resp.coords.latitude;
      const longitud = resp.coords.longitude;
      this.modalCtrl.dismiss({check: true, latitud, longitud});
     }).catch((error) => {
       console.log('Error getting location', error);
       this.modalCtrl.dismiss({check: true, latitud: 0, longitud: 0});
     });
  }

  regresar(){
    this.modalCtrl.dismiss({check: false});
  }

}
