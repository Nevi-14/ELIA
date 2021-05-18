import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PDV } from 'src/app/models/pdv';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.page.html',
  styleUrls: ['./checkin.page.scss'],
})
export class CheckinPage {

  @Input() pdv: PDV;

  constructor( private modalCtrl: ModalController ) { }

  checkIn(){
    this.modalCtrl.dismiss({check: true});
  }

  regresar(){
    this.modalCtrl.dismiss({check: false});
  }

}
