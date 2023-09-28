import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImaEncuestas } from 'src/app/models/imaEncuestas';
import { ImaEncuestasLinea } from 'src/app/models/imaEncuestasLinea';
import { EncuestaLineasService } from 'src/app/services/encuesta-lineas.service';
import { EncuestasService } from 'src/app/services/encuestas.service';

@Component({
  selector: 'app-editar-pregunta',
  templateUrl: './editar-pregunta.page.html',
  styleUrls: ['./editar-pregunta.page.scss'],
})
export class EditarPreguntaPage implements OnInit {
  @Input() pregunta:ImaEncuestasLinea
  encuestas:ImaEncuestas[]=[]
  constructor(
public modalCtrl:ModalController,
public encuestasServiceService:EncuestasService,
public encuestaLineasService:EncuestaLineasService

  ) { }

  ngOnInit() {
    console.log('pregunta', this.pregunta)
    this.encuestasServiceService.syncGetEncuestasToPromise().then(encuestas =>{
      this.encuestas = encuestas
      console.log('encuestas',encuestas)
    
    }, error =>{
      console.log('error', error)
    })
  }
  cerrarModal(){
    this.modalCtrl.dismiss();
  }

 editarPregunta(){
    this.encuestaLineasService.syncPutRespuestaEncuestaToPromise(this.pregunta).then(resp =>{
      console.log('resp', resp)
      this.modalCtrl.dismiss(true)
    }, error =>{
      this.modalCtrl.dismiss(true)
      console.log('error', error)
    })
  }
}
