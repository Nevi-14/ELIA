import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
 
interface modules {
  title: string,
  subtitle: string,
  img: string,
  action: number
}
@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})
export class InformacionPage implements OnInit {
  year = new Date().getFullYear();
 
  constructor(
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}
