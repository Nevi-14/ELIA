import { Component, OnInit } from '@angular/core';
import { CrearEncuestaPage } from '../crear-encuesta/crear-encuesta.page';
import { ModalController } from '@ionic/angular';
import { CrearPreguntaPage } from '../crear-pregunta/crear-pregunta.page';
import { ImaEncuestas } from 'src/app/models/imaEncuestas';
import { ImaEncuestasLinea } from 'src/app/models/imaEncuestasLinea';
import { EncuestasService } from 'src/app/services/encuestas.service';
import { EncuestaLineasService } from 'src/app/services/encuesta-lineas.service';
import { EncuestaClientesService } from 'src/app/services/encuesta-clientes.service';
import { EditarEncuestaPage } from '../editar-encuesta/editar-encuesta.page';
import { EditarPreguntaPage } from '../editar-pregunta/editar-pregunta.page';
 
@Component({
  selector: 'app-encuestas-preguntas',
  templateUrl: './encuestas-preguntas.page.html',
  styleUrls: ['./encuestas-preguntas.page.scss'],
})
export class EncuestasPreguntasPage implements OnInit {
  isOpen:boolean = false;
  encuestas:ImaEncuestas[]=[]
  preguntas:ImaEncuestasLinea[]=[]
  constructor(
    public modalCtrl:ModalController,
    public encuestasServiceService:EncuestasService,
    public encuestasLineasService:EncuestaLineasService,
    public encuestaClientesService:EncuestaClientesService
  ) { }

  ngOnInit() {
    
    this.encuestasServiceService.syncGetEncuestasToPromise().then(encuestas =>{
      this.encuestas = encuestas
      console.log('encuestas',encuestas)
      this.encuestasLineasService.syncGetEncuestasLineasToPromise(this.encuestas[0].id).then(preguntas =>{
        this.preguntas = preguntas;
        console.log(preguntas)
      })

    }, error =>{
      console.log('error', error)
    })
  }
 
  cargarPreguntas(encuesta:ImaEncuestas){
    this.encuestasServiceService.syncGetEncuestasToPromise().then(encuestas =>{
      this.encuestas = encuestas
      console.log('encuestas',encuestas)
      this.encuestasLineasService.syncGetEncuestasLineasToPromise(encuesta.id).then(preguntas =>{
        this.preguntas = preguntas;
        console.log(preguntas)
      })

    }, error =>{
      console.log('error', error)
    })
  }
  async crearEncuesta() {
 
    if (!this.isOpen) {
      this.isOpen = true;
      const modal = await this.modalCtrl.create({
        component: CrearEncuestaPage,
        cssClass: 'ui-modal',
        mode:'ios'
      })

      modal.present();
      const { data } = await modal.onWillDismiss();
      this.isOpen = false;

      if(data != undefined){
         
      }


    }

  }

  async editarEncuesta(encuesta:ImaEncuestas) {
 
    if (!this.isOpen) {
      this.isOpen = true;
      const modal = await this.modalCtrl.create({
        component: EditarEncuestaPage,
        componentProps:{
          encuesta
        },
        cssClass: 'ui-modal',
        mode:'ios'
      })

      modal.present();
      const { data } = await modal.onWillDismiss();
      this.isOpen = false;

      if(data != undefined){
         
      }


    }

  }

  async editarPregunta(pregunta:ImaEncuestasLinea) {
 let encuestas = await this.encuestasServiceService.syncGetEncuestasToPromise()
    if (!this.isOpen) {
      this.isOpen = true;
      const modal = await this.modalCtrl.create({
        component: EditarPreguntaPage,
        componentProps:{
          encuestas,
          pregunta  
        },
        cssClass: 'ui-modal',
        mode:'ios'
      })

      modal.present();
      const { data } = await modal.onWillDismiss();
      this.isOpen = false;

      if(data != undefined){
         
      }


    }

  }
  async crearPregunta() {
 
    if (!this.isOpen) {
      this.isOpen = true;
      const modal = await this.modalCtrl.create({
        component: CrearPreguntaPage,
        cssClass: 'ui-modal',
        mode:'ios',
        
      })

      modal.present();
      const { data } = await modal.onWillDismiss();
      this.isOpen = false;

      if(data != undefined){
         
      }


    }

  }
  
}
