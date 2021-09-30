import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { EliaService } from 'src/app/services/elia.service';
import { TareasService } from 'src/app/services/tareas.service';
import { AdminPage } from '../admin/admin.page';
import { LoginPage } from '../login/login.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor( private tareas: TareasService,
               private elia: EliaService,
               private geolocation: Geolocation,
               private modalCtrl: ModalController,
               private alertCtrl: AlertController ) {}

  async abrirLogin(){
    const modal = await this.modalCtrl.create({
      component: LoginPage,
      cssClass: 'my-custom-class'
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if ( data.check ){
      this.abrirAdmin();
    } else {
      return;
    }
  }
  
  async abrirAdmin(){
    const modal1 = await this.modalCtrl.create({
      component: AdminPage,
      cssClass: 'my-custom-class'
    });
    await modal1.present();
    const {data} = await modal1.onDidDismiss();
    if ( data.check ){
      this.tareas.cargarRutero();
    }
  }

  async sincronizar(){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirmación',
      message: 'Desea sincronizar.  Esta acción borrará la información que no haya transmitido...',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            console.log('Confirm Okay');
            this.sincronizarDatos();
          }
        }
      ]
    });

    await alert.present();
  }

  sincronizarDatos(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.tareas.varConfig.latitud1 = resp.coords.latitude;
      this.tareas.varConfig.longitud1 = resp.coords.longitude;
      if ( this.tareas.varConfig.ruta !== 'ME00'){
        const fecha = new Date();
        this.tareas.varConfig.horaSincroniza = new Date(new Date(fecha).getTime() - (new Date(fecha).getTimezoneOffset() * 60000));
        this.tareas.guardarVarConfig();
        this.elia.syncVisitas( this.tareas.varConfig );
        this.elia.syncClientes( this.tareas.varConfig.ruta, false );
        this.elia.syncArticulos();
        if (localStorage.getItem('ELIAvisitaDiaria')){
          localStorage.removeItem('ELIAvisitaDiaria');
        }
      } else {
        this.tareas.presentAlertW('Sincronización', 'La aplicación no tiene una ruta definda...');
      }
    }).catch((error) => {
       console.log('Error getting location', error);
       this.tareas.presentAlertW('Sincronización', 'Error de GPS...!!!')
    });
    
  }

}
