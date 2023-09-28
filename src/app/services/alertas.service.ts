import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  isLoading = false;
  loading: HTMLIonLoadingElement | any;
  textoBuscar = ''


  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) { }



  


  async presentaLoading( message: string ){
    this.isLoading = true;
    this.loadingCtrl.create({
      message: message ? message : 'Please wait...'
    }).then(loader => {
      loader.present().then(() => {
        if (!this.isLoading) {
          loader.dismiss();
        }
      });
    });
  }
  async   loadingDissmiss(){
    this.isLoading = false;
    this.loadingCtrl.getTop().then(loader => {
      if (loader) {
        loader.dismiss();
      }
    });
  }
  
  

  async  message(header:string,message:string){
    
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();

}





removerEspacios(element:string) {

  return element.split(' ').join('');


  }

// VALIDAR CORREO


validarCorreo(email:string) {


  const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return regularExpression.test(String(email).toLowerCase());



 }




}
