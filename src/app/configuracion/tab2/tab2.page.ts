import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TareasService } from 'src/app/services/tareas.service';
import { AdminPage } from '../admin/admin.page';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor( private tareas: TareasService,
               private modalCtrl: ModalController ) {}

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

}
