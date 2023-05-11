import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TareasService } from 'src/app/services/tareas.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  showPass = false;
  usuarioForm = {
    usuarioF: '',
    claveF: '',
  };
  intentos: number = 0;

  constructor( private modalCtrl: ModalController,
               private tareas: TareasService ) { }

  ngOnInit() {
  }

  login(){
    if (this.intentos <= 3) { 
      if ( this.usuarioForm.usuarioF === 'admin' && this.usuarioForm.claveF === environment.adminClave ){
        this.modalCtrl.dismiss({check: true});
      } else {
        this.tareas.presentAlertW('Login', 'Usuario o clave incorrectos...');
        this.intentos += 1;
      }
    } else {
      this.tareas.presentAlertW('Login', 'Ha excedido la cantidad de intentos fallidos.  Se bloqueará la aplicación.');
      this.modalCtrl.dismiss({check: false});
    }
  }

  salir(){
    this.modalCtrl.dismiss({check: false});
  }

}
