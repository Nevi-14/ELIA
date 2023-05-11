import { Component, Input, OnInit } from '@angular/core';
import { EncuestasClienteVista } from 'src/app/models/encuestasClienteVista';
import { VisitaDiaria } from 'src/app/models/rutero';
import { EncuestasService } from 'src/app/services/encuestas.service';
import { EncuestaLineasPage } from '../encuesta-lineas/encuesta-lineas.page';
import { ModalController } from '@ionic/angular';
import { RespuestasEncuestasService } from 'src/app/services/respuestas-encuestas.service';

@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.page.html',
  styleUrls: ['./encuestas.page.scss'],
})
export class EncuestasPage implements OnInit {
  constructor(
 public encuestasService:EncuestasService,
 public modalCtrl:ModalController,
 public respuestasEncuestasService:RespuestasEncuestasService   
  ) { }

  ngOnInit() {
    this.encuestasService.syncGetEncuestasClienteVista(this.respuestasEncuestasService.visita.idPDV).then( encuestas =>{
      this.encuestasService.encuestas = encuestas;
    }, error =>{
      console.log('error', error)
    })
  }
  async encuestaLinea(encuesta:EncuestasClienteVista){
 this.modalCtrl.dismiss();
    const modal = await this.modalCtrl.create({
      component: EncuestaLineasPage,
      mode: 'md',
      componentProps: {
        encuesta
      },
      cssClass: 'my-custom-class',
      
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    
  }
}
