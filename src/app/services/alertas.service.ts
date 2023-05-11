import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  isLoading = false;
  loading: HTMLIonLoadingElement;
  title:string = null;


  constructor(

    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController


  ) { }




  async presentaLoading(message: string) {

    this.isLoading = true;

    this.loadingCtrl.create({

      message: message ? message : 'Please wait...',
      cssClass: 'activity-detail-loading'

    }).then(loader => {

      loader.present().then(() => {

        if (!this.isLoading) {
          loader.dismiss();
        }

      });

    });
  }
  async loadingDissmiss() {
    this.isLoading = false;
    // Instead of directly closing the loader like below line
    // return await this.loadingController.dismiss();

    this.checkAndCloseLoader();

    // sometimes there's delay in finding the loader. so check if the loader is closed after one second. if not closed proceed to close again
    setTimeout(() => this.checkAndCloseLoader(), 1000);
  }

  async closeLoader() {
    // Instead of directly closing the loader like below line
    // return await this.loadingController.dismiss();

    this.checkAndCloseLoader();

    // sometimes there's delay in finding the loader. so check if the loader is closed after one second. if not closed proceed to close again
    setTimeout(() => this.checkAndCloseLoader(), 1000);

  }

  async checkAndCloseLoader() {
    // Use getTop function to find the loader and dismiss only if loader is present.
    const loader = await this.loadingCtrl.getTop();
    // if loader present then dismiss
    if (loader !== undefined) {
      await this.loadingCtrl.dismiss();
    }
  }

  async message(header, message) {

    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();

  }








}
