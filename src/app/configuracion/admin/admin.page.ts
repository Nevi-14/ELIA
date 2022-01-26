import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { EliaService } from 'src/app/services/elia.service';
import { TareasService } from 'src/app/services/tareas.service';
import { environment } from 'src/environments/environment';
import { RutasPage } from '../rutas/rutas.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  texto: string;
  ambiente: string = '';
  version: string = '';

  constructor( private tareas: TareasService,
               private elia: EliaService,
               private modalCtrl: ModalController,
               private geolocation: Geolocation,
               private popoverCtrl: PopoverController ) { }

  ngOnInit() {
    if ( environment.production){
      this.ambiente = 'PRD';
    } else {
      this.ambiente = 'DEV';
    }
    this.version = environment.version;
    if (this.tareas.rutas.length == 0) {
      //this.tareas.presentaLoading('Sincronizando Rutas...');
      this.elia.getRutas().subscribe(
        resp => {
          console.log('RutasBD', resp );
          this.tareas.rutas = resp;
          //this.tareas.loadingDissmiss();
          this.tareas.presentaToast('Rutas cargadas...');
          console.log( 'Arreglo', this.tareas.rutas );
        }, error => {
          console.log(error.message);
          //this.tareas.loadingDissmiss();
          this.tareas.presentAlertW('Cargando Rutas', error.message);
        }
      );                                // Actualiza la lista de rutas en ISA
    }
  }

  async rutasPoppover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: RutasPage,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    await popover.present();

    const {data} = await popover.onWillDismiss();

    if (data !== undefined) {
      this.tareas.varConfig = this.tareas.rutas[data.indice];         // Asigna la nueva ruta a la varaible de entorno de ISA
      this.texto = this.tareas.varConfig.ruta;

    }
  }

  sincronizar(){
    this.geolocation.getCurrentPosition(/*{enableHighAccuracy: true, timeout: 5000, maximumAge: 0}*/).then(
      resp => {
        this.tareas.varConfig.latitud1 = resp.coords.latitude;
        this.tareas.varConfig.longitud1 = resp.coords.longitude;
        if ( this.tareas.varConfig.ruta !== 'ME00'){
          const fecha = new Date();
          this.tareas.varConfig.horaSincroniza = new Date();
          this.tareas.guardarVarConfig();
          this.elia.syncVisitas( this.tareas.varConfig );
          this.elia.syncClientes( this.tareas.varConfig.ruta, true );
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

  salir(){
    this.modalCtrl.dismiss({check: false});
  }

}
