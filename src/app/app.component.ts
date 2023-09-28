import { Component, HostListener } from '@angular/core';
import { AlertController, MenuController, PopoverController } from '@ionic/angular';
import { ImaService } from './services/ima.service';
import { Router } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { AppSetingsService } from './services/app-settings.service';
import { CalendarioPopoverPage } from './pages/calendario-popover/calendario-popover.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Checkbox', url: 'folder/CheckBox', icon: 'checkbox' },
    { title: 'Encuestas Clientes', url: 'encuestas-clientes', icon: 'help-circle' },
    { title: 'Ruta', url: 'ruta', icon: 'sync' },
    { title: 'Mapa', url: 'mapa', icon: 'map' },
    { title: 'Configuración', url: 'admin', icon: 'build' }
  ];
  public labels = ['Clientes', 'Rutas', 'Visitados', 'En proceso', 'Pendientes'];
  class: boolean = false;
  width: number = 0;
  url = '';
  showMenu = false;
  large: boolean = false;
  small: boolean = false;
  image = '../assets/islena.png';
  year = new Date().getFullYear();
  constructor( public ima: ImaService,
               private alertController: AlertController,
               private router: Router,
               private popoverCtrl: PopoverController,
               public appSettingsService:AppSetingsService,
               public menuCtrl: MenuController
               ) {}
               async fecha() {
                const popover = await this.popoverCtrl.create({
                  component: CalendarioPopoverPage,
                  cssClass: 'my-custom-class',
                  translucent: true,
                  componentProps: {
                    fecha: new Date(),
                    max:  new Date().getFullYear() +3
                  }
                })
            
                await popover.present();
                const { data } = await popover.onDidDismiss();
                if (data != undefined) {
            
                  console.log('data', data)
            
                  const anio = data.fecha.slice(0,4);
                  const mes = data.fecha.slice(5,7);
                  const dia = data.fecha.slice(8);
                //  diaSemana = `${mes}-${dia}-${anio}`;
                 // this.ima.fecha = new Date(diaSemana);
                 this.ima.fecha = new Date(data.fecha)
               // console.log(  this.ima.getID(this.ima.fecha));
               //this.ima.cargarRutero(this.ima.getID(this.ima.fecha));      
               this.ima.syncRuteroWeb(this.ima.getID(this.ima.fecha));
               this.router.navigate(['/folder/Checkbox']);
                }
            
                
              }
  async cambiarFecha(){
    let diaSemana= 'ND'; 
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Fecha',
      inputs: [
        {
          name: 'fecha',
          id: 'fechaAlert',
          type: 'date',
          placeholder: 'Fecha Rutero',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Ok',
          handler: (data) => {
          //  console.log(data);
            if (data.fecha !== ''){
              const anio = data.fecha.slice(0,4);
              const mes = data.fecha.slice(5,7);
              const dia = data.fecha.slice(8);
              diaSemana = `${mes}-${dia}-${anio}`;
              this.ima.fecha = new Date(diaSemana);
           // console.log(  this.ima.getID(this.ima.fecha));
           //this.ima.cargarRutero(this.ima.getID(this.ima.fecha));      
           this.ima.syncRuteroWeb(this.ima.getID(this.ima.fecha));
           this.router.navigate(['/folder/Checkbox']);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async login( ev: any ){
    let usuario: string = '';

    if ( this.ima.usuarios.usuario !== '' ){
      usuario = this.ima.usuarios.usuario
    }
    const popover = await this.popoverCtrl.create({
      component: LoginPage,
      componentProps: {
        'usuario': usuario,
      },
      cssClass: 'login-popover',
      event: ev,
      translucent: true
    });
    await popover.present();
    const {data} = await popover.onWillDismiss();
    if ( data !== undefined){

      if ( data.login ){
        this.ima.logging = true;
        this.ima.cargarRutero( this.ima.id );
      }
      if ( data.logout ){
        this.ima.logging = false;
        this.ima.rutero = [];
        this.ima.usuarios.usuario = '';
        this.ima.usuarios.email = '';
        this.ima.usuarios.email = '';
        this.ima.usuarios.nombre = '';
      }
    }
  }
    // REMVOE MENU ON BIGGER SCREENS
    menuAction(url:string) {
      this.class = false;
      this.appSettingsService.menu = false;
      if (url == 'salir') {
     
      } else {
        this.router.navigateByUrl(url, { replaceUrl: true })
      }
  
    }
  openMenu() {
    if (!this.appSettingsService.menu) {
      this.class = true;
      this.menuCtrl.open();
      this.appSettingsService.menu = true;
    }

  }

  closeMenu() {
    if (this.appSettingsService.menu) {
      this.class = false;
      this.menuCtrl.close();
      this.appSettingsService.menu = false;
    }

  }
  toggleMenu() {

    if (this.width > 768) {
      this.large = true;
      this.small = false;
      //this.class = true;
      // this.menuCtrl.toggle('myMenu');
      this.small = false;
    } else {
      this.class = false;
      this.large = false;
      this.small = true;
      // this.menuCtrl.toggle('myMenu');




    }

  }

  toggle() {
    this.class = true;
    this.menuCtrl.toggle('myMenu');

    this.appSettingsService.menu = !this.appSettingsService.menu;

  }
  // CHECKS SCREEN RESIZE LIVE

  @HostListener('window:resize', ['$event'])

  private onResize($event:any) {

    this.width = $event.target.innerWidth;

    this.toggleMenu();

  }
}
