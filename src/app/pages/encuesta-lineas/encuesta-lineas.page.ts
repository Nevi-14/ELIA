import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EncuestasClienteVista } from 'src/app/models/encuestasClienteVista';
import { RespuestasEncuestasService } from 'src/app/services/respuestas-encuestas.service';
import { RespuestasEncuestas } from 'src/app/models/respuestasEncuestas';
import { AlertasService } from 'src/app/services/alertas.service';

@Component({
  selector: 'app-encuesta-lineas',
  templateUrl: './encuesta-lineas.page.html',
  styleUrls: ['./encuesta-lineas.page.scss'],
})
export class EncuestaLineasPage implements OnInit {
@Input() encuesta:EncuestasClienteVista | any
 repuestas:RespuestasEncuestas[]  = []
  constructor(
  public modalCtrl:ModalController,
  public respuestasEncuestasService:RespuestasEncuestasService,
  public alertasService:AlertasService  
  ) { }

  ngOnInit() {
    console.log(this.encuesta)
    this.cargarRespuestas();
  }
  cerrarModal(){
    this.modalCtrl.dismiss();

  }

  cargarRespuestas(){
    this.respuestasEncuestasService.syncGetRespuestasEncuestasToPromise(this.encuesta.id, this.encuesta.linea).then((resp:any) =>{
      console.log('resp', resp)
    this.repuestas = resp;
    }, error =>{
      console.log('error', error)
    })
  }

 
}
