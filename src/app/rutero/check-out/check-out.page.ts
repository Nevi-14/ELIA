import { Component, Input } from '@angular/core';
import { PDV } from '../../models/pdv';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.page.html',
  styleUrls: ['./check-out.page.scss'],
})
export class CheckOutPage {

  @Input() pdv: PDV;

  constructor( private modalCtrl: ModalController ) { }

  checkOut(){
    this.modalCtrl.dismiss({check: true});
  }

  regresar(){
    this.modalCtrl.dismiss({check: false});
  }

}
