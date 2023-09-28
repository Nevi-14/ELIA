import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EncuestasService } from 'src/app/services/encuestas.service';
import { CrearEncuestaClientePage } from '../crear-encuesta-cliente/crear-encuesta-cliente.page';
import { ModalController } from '@ionic/angular';
import { EncuestasClienteVista } from 'src/app/models/encuestasClienteVista';
import { EncuestaLineasPage } from '../encuesta-lineas/encuesta-lineas.page';

@Component({
  selector: 'app-encuestas-clientes',
  templateUrl: './encuestas-clientes.page.html',
  styleUrls: ['./encuestas-clientes.page.scss'],
})
export class EncuestasClientesPage implements OnInit {
  isOpen:boolean = false;
  encuestas:EncuestasClienteVista[]=[]
  constructor(
    public encuestasService:EncuestasService ,
    public router:Router,
    public modalCtrl:ModalController 
    ) { }
  
    ngOnInit() {
      this.encuestasService.syncGetEncuestaClientesVista().then((encuestas) =>{
        console.log(encuestas)
        this.encuestas = encuestas;
      });
    }
    async clientesRespuestas(cliente:EncuestasClienteVista) {

       if (!this.isOpen) {
         this.isOpen = true;
         const modal = await this.modalCtrl.create({
           component: EncuestaLineasPage,
           componentProps:{
             encuesta:cliente
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
    encuestasLineas(){
      this.router.navigateByUrl('encuestas-preguntas', {replaceUrl:true})
    }
    async crearEncuestaCliente() {
 
      if (!this.isOpen) {
        this.isOpen = true;
        const modal = await this.modalCtrl.create({
          component: CrearEncuestaClientePage,
          cssClass: 'ui-modal',
          mode:'ios'
        })
  
        modal.present();
        const { data } = await modal.onWillDismiss();
        this.isOpen = false;
  
        if(data != undefined){
          this.encuestasService.syncGetEncuestaClientesVista().then((encuestas) =>{
            console.log(encuestas)
            this.encuestas = encuestas;
          });
        }
  
  
      }
  
    }
}
