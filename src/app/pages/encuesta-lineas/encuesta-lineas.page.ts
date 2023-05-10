import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EncuestasClienteVista } from 'src/app/models/encuestasClienteVista';

@Component({
  selector: 'app-encuesta-lineas',
  templateUrl: './encuesta-lineas.page.html',
  styleUrls: ['./encuesta-lineas.page.scss'],
})
export class EncuestaLineasPage implements OnInit {
@Input() encuesta:EncuestasClienteVista
  constructor(
  public modalCtrl:ModalController  
  ) { }

  ngOnInit() {
    console.log(this.encuesta)
  }
  regresar(){
    this.modalCtrl.dismiss();

  }
}
