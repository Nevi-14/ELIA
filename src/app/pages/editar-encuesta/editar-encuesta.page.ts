import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { format } from 'date-fns';
import { ImaEncuestas } from 'src/app/models/imaEncuestas';
import { EncuestasService } from 'src/app/services/encuestas.service';
import { CalendarioPopoverPage } from '../calendario-popover/calendario-popover.page';

@Component({
  selector: 'app-editar-encuesta',
  templateUrl: './editar-encuesta.page.html',
  styleUrls: ['./editar-encuesta.page.scss'],
})
export class EditarEncuestaPage implements OnInit {
  name = '';
  @Input() encuesta:ImaEncuestas
  
  formatoFecha = new Date(format(new Date(), 'yyy/MM/dd')).toISOString();
    constructor(
   public modalCtrl: ModalController,
   public encuestasService:EncuestasService,
   public popOverCtrl:PopoverController
    ) { }
  
    ngOnInit() {
    }
    cerrarModal(){
      this.modalCtrl.dismiss();
    }
    actualizarEncuesta(){
  this.encuestasService.syncPutEncuestaToPromise(this.encuesta).then(resp =>{
    console.log('resp', resp)
    this.modalCtrl.dismiss(true)
  }, error =>{
  
    console.log('error', error)
  })
    }
  
    async fecha(identificador: string) {
      console.log('identificador', identificador)
      let nuevaFecha = null;
      switch (identificador) {
        case 'vigencia_Inicio':
          nuevaFecha = this.encuesta.vigencia_Inicio;
  
          break;
        case 'vigencia_Fin':
  
          nuevaFecha = this.encuesta.vigencia_Fin;
          break;
      }
      const popover = await this.popOverCtrl.create({
        component: CalendarioPopoverPage,
        cssClass: 'my-custom-class',
        translucent: true,
        componentProps: {
          fecha: nuevaFecha,
          max:  new Date().getFullYear() +3
        }
      })
  
      await popover.present();
      const { data } = await popover.onDidDismiss();
      if (data != undefined) {
  
        console.log('data', data)
  
        this.formatoFecha = data.fecha;
  
        switch (identificador) {
          case 'vigencia_Inicio':
   
          this.encuesta.vigencia_Inicio = new Date(this.formatoFecha);
   
            break;
          case 'vigencia_Fin':
            this.encuesta.vigencia_Fin = new Date(this.formatoFecha);
            break;
        }
      }
  
      console.log('this.encuesta', this.encuesta)
    }

}
