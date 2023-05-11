import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EncuestasClienteVista } from 'src/app/models/encuestasClienteVista';
import { RespuestasEncuestas } from 'src/app/models/respuestasEncuestas';
import { AlertasService } from 'src/app/services/alertas.service';
import { RespuestasEncuestasService } from 'src/app/services/respuestas-encuestas.service';

@Component({
  selector: 'app-formulario-respuesta',
  templateUrl: './formulario-respuesta.page.html',
  styleUrls: ['./formulario-respuesta.page.scss'],
})
export class FormularioRespuestaPage implements OnInit {
  @Input() encuesta: EncuestasClienteVista

  text: string;
  seun: string;
  susn: string;
  semu: any[] = [];
  opciones: any[] = [];
  constructor(
    public modalCtrl: ModalController,
    public respuestasEncuestasService: RespuestasEncuestasService,
    public alertasService:AlertasService
  ) { }

  ngOnInit() {
    switch (this.encuesta.tipo_Respuesta) {
      case 'SUSN':
        this.opciones = this.encuesta.datos.split('//')
        console.log(this.encuesta.datos.split('//'), 'SUSN')
        break;
      case 'SEUN':
        this.opciones = this.encuesta.datos.split('//');
        console.log(this.encuesta.datos.split('//'), 'SEUN')
        break;

      case 'SEMU':
        this.opciones = this.encuesta.datos.split('//');
        console.log(this.encuesta.datos.split('//'), 'SEMU')
        break;
      default:

        break;
    }
  }
  regresar() {
    this.modalCtrl.dismiss();
  }

  retordarDatos() {
    this.alertasService.presentaLoading('Guardando cambios..')
    let respuesta: RespuestasEncuestas = {
      id: null,
      encuesta: this.encuesta.id,
      linea: this.encuesta.linea,
      usuario: null,
      fecha: new Date(),
      respuesta: ''
    }
    switch (this.encuesta.tipo_Respuesta) {

      case 'TEXT':
        respuesta.respuesta = this.text;
        this.respuestasEncuestasService.syncPostRespuestaEncuestaToPromise(respuesta).then(resp => {
          this.alertasService.loadingDissmiss();
          this.alertasService.message('ELIA','Respuesta guardada..')
          this.modalCtrl.dismiss(true)
          console.log('resp', resp)
        }, error => {
          console.log('error', error)
          this.alertasService.loadingDissmiss();
          this.alertasService.message('ELIA','Lo sentimos algo salio mal..')
          console.log('error', error)
        })
        break;
 case 'SUSN':
        respuesta.respuesta = this.susn;
        this.respuestasEncuestasService.syncPostRespuestaEncuestaToPromise(respuesta).then(resp => {
          this.alertasService.loadingDissmiss();
          this.alertasService.message('ELIA','Respuesta guardada..')
          this.modalCtrl.dismiss(true)
          console.log('resp', resp)
          
        }, error => {
          console.log('error', error)
          this.alertasService.loadingDissmiss();
          this.alertasService.message('ELIA','Lo sentimos algo salio mal..')
          console.log('error', error)
        })
        break;
        case 'SEUN':
      case 'SEUN':
        respuesta.respuesta = this.seun;
        this.respuestasEncuestasService.syncPostRespuestaEncuestaToPromise(respuesta).then(resp => {
          this.alertasService.loadingDissmiss();
          this.alertasService.message('ELIA','Respuesta guardada..')
          this.modalCtrl.dismiss(true)
          
          console.log('resp', resp)
        }, error => {
          console.log('error', error)
          this.alertasService.loadingDissmiss();
          this.alertasService.message('ELIA','Lo sentimos algo salio mal..')
          console.log('error', error)
        })
        break;

      case 'SEMU':


        this.semu.forEach((resp, index) => {
          if (resp) respuesta.respuesta += ` ${resp} //`

          if (index == this.semu.length - 1) {
            this.respuestasEncuestasService.syncPostRespuestaEncuestaToPromise(respuesta).then(resp => {
              this.alertasService.loadingDissmiss();
              this.alertasService.message('ELIA','Respuesta guardada..')
              this.modalCtrl.dismiss(true)
              console.log('resp', resp)
            }, error => {
              this.alertasService.loadingDissmiss();
              this.alertasService.message('ELIA','Lo sentimos algo salio mal..')
              console.log('error', error)
            })

          }
        })
        break;
      default:

        break;
    }
  }

  agregarSeleccionMultiple($event) {
    let isChecked = $event.detail.checked;
    let value = $event.detail.value;
    let i = this.semu.findIndex(e => e == value);
    if (isChecked) {
      if (i < 0) {
        this.semu.push(value);
      }
    } else {
      if (i >= 0) {
        this.semu.splice(i, 1);
      }
    }
    console.log(this.semu, 'this.semu')

  }
}
