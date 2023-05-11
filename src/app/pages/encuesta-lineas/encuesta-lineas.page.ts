import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EncuestasClienteVista } from 'src/app/models/encuestasClienteVista';
import { FormularioRespuestaPage } from '../formulario-respuesta/formulario-respuesta.page';
import { RespuestasEncuestasService } from 'src/app/services/respuestas-encuestas.service';
import { RespuestasEncuestas } from 'src/app/models/respuestasEncuestas';
import { AlertasService } from 'src/app/services/alertas.service';

@Component({
  selector: 'app-encuesta-lineas',
  templateUrl: './encuesta-lineas.page.html',
  styleUrls: ['./encuesta-lineas.page.scss'],
})
export class EncuestaLineasPage implements OnInit {
@Input() encuesta:EncuestasClienteVista
 
  constructor(
  public modalCtrl:ModalController,
  public respuestasEncuestasService:RespuestasEncuestasService,
  public alertasService:AlertasService  
  ) { }

  ngOnInit() {
    console.log(this.encuesta)
    this.cargarRespuestas();
  }
  regresar(){
    this.modalCtrl.dismiss();

  }

  cargarRespuestas(){
    this.respuestasEncuestasService.syncGetRespuestasEncuestasToPromise(this.encuesta.id, this.encuesta.linea).then(resp =>{
      console.log('resp', resp)
      this.respuestasEncuestasService.respuestas = resp;
    }, error =>{
      console.log('error', error)
    })
  }

  async formulario( ){
 
    const modal = await this.modalCtrl.create({
      component: FormularioRespuestaPage,
      mode: 'ios',
      initialBreakpoint: 0.65,
      breakpoints: [0, 0.25, 0.5, 0.75],
      componentProps: {
        encuesta:this.encuesta
      },
      cssClass: 'my-custom-class',
      
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();

    if(data != undefined){
      console.log(data, 'data')

      this.cargarRespuestas();

    }
    
  }

  borrarRespuestaEncuesta(encuesta:RespuestasEncuestas){
    this.alertasService.presentaLoading('Borrando respuesta...')
    this.respuestasEncuestasService.syncDeleteRespuestaEncuestaToPromise(encuesta.id).then(resp =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('ELIA','Respuesta borrada..')
      this.cargarRespuestas();
    }, error =>{
      console.log('error', error)
      this.alertasService.loadingDissmiss();
      this.alertasService.message('ELIA','Lo sentimos algo salio mal..')
    })
  }
}
