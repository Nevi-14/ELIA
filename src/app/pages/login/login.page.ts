import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ImaService } from '../../services/ima.service';
import { Usuarios } from '../../models/ruta';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @Input() usuario: string | any;

  usuarioForm = {
    usuarioF: '',
    claveF: '',
  };
  intentos: number = 1;
  showPass = false;

  constructor( public ima: ImaService,
               private popoverCtrl: PopoverController ) { }

  ngOnInit() {
    if ( this.usuario !== '' ){
      this.usuarioForm.usuarioF = this.usuario;
    }
  }

  login(){
    let usuarios: Usuarios[] = [];

    if (this.intentos <= 3) {
      this.ima.getUsuarios(this.usuarioForm.usuarioF).subscribe(
        resp => {
          usuarios = resp.slice(0);
          if ( usuarios.length > 0 && usuarios[0].clave === this.usuarioForm.claveF ){
            this.ima.usuarios = usuarios[0];
            this.popoverCtrl.dismiss({'login': true});
          } else {
            this.ima.presentAlertW('Login', 'Usuario o clave incorrectos...');
            this.intentos += 1;
          }
        }, error => {
          console.log(error.message);
          this.ima.presentAlertW('Error Autenticando con la Base de Datos. Favor contactar con su Administrador.', error.message);
        }
      );
    } else {
      this.ima.presentAlertW('Login', 'Ha excedido la cantidad de intentos fallidos.  Se bloqueará la aplicación.');
      this.popoverCtrl.dismiss({'login': false});
    }
  }

  logout(){
    this.popoverCtrl.dismiss({'logout': true});
  }

  salir(){
    this.popoverCtrl.dismiss({'login': false});
  }

}
