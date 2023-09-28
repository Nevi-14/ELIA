import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClientesBD } from 'src/app/models/clientes';
import { ImaEncuestasClientes } from 'src/app/models/imaEncuestasClientes';
import { ImaEncuestasLinea } from 'src/app/models/imaEncuestasLinea';
import { EncuestaClientesService } from 'src/app/services/encuesta-clientes.service';
import { EncuestaLineasService } from 'src/app/services/encuesta-lineas.service';
import { ImaService } from 'src/app/services/ima.service';

@Component({
  selector: 'app-crear-encuesta-cliente',
  templateUrl: './crear-encuesta-cliente.page.html',
  styleUrls: ['./crear-encuesta-cliente.page.scss'],
})
export class CrearEncuestaClientePage implements OnInit {
clientes:ClientesBD[]=[]
encuesta:ImaEncuestasClientes = {
   id:    0,
   linea:0,
   cliente: '',
   repeticioneS_RESTANTES:0,
   aplicado:     '',
   fechA_APLICADO:   new Date()
}
preguntas:ImaEncuestasLinea[]=[]
  constructor(
public modalCtrl:ModalController,
public imaService:ImaService,
public encuestasLineasService:EncuestaLineasService,
public encuestaslientesService:EncuestaClientesService  

  ) { }

  ngOnInit() {

 
    this.imaService.getIMAClientes().subscribe(
      clientes => {
      console.log('clientes', clientes)
      this.clientes = clientes;
      this.encuestasLineasService.syncGetLineasToPromise().then(preguntas =>{
        this.preguntas = preguntas;
        console.log(preguntas)
      })
    })
  }
  cerrarModal(){
    this.modalCtrl.dismiss(true)

  }

  guardarEncuesta(){
    this.encuestaslientesService.syncPostEncuestaClienteToPromise(this.encuesta).then(resp =>{
      console.log('resp', resp)
      this.modalCtrl.dismiss(true);
    }, error =>{
      console.log('error', error)
      this.modalCtrl.dismiss(true)
    })
  }
}
