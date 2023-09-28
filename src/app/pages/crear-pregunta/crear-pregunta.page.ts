import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImaEncuestas } from 'src/app/models/imaEncuestas';
import { ImaEncuestasLinea } from 'src/app/models/imaEncuestasLinea';
import { EncuestaLineasService } from 'src/app/services/encuesta-lineas.service';
import { EncuestasService } from 'src/app/services/encuestas.service';

@Component({
  selector: 'app-crear-pregunta',
  templateUrl: './crear-pregunta.page.html',
  styleUrls: ['./crear-pregunta.page.scss'],
})
export class CrearPreguntaPage implements OnInit {
  encuestas:ImaEncuestas[]=[]
  pregunta:ImaEncuestasLinea = {
     id:    0,
     iD_ENCUESTA: 0,
     pregunta:     '',
     tipo_Respuesta:   '',
     repite:0,
     datos:''
  }
  constructor(
public modalCtrl:ModalController,
public encuestasServiceService:EncuestasService,
public encuestaLineasService:EncuestaLineasService

  ) { }

  ngOnInit() {
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

  guardarPregunta(){
    this.encuestaLineasService.syncPostRespuestaEncuestaToPromise(this.pregunta).then(resp =>{
      console.log('resp', resp)
      this.modalCtrl.dismiss(true)
    }, error =>{
      this.modalCtrl.dismiss(true)
      console.log('error', error)
    })
  }
}
