import { Component, Input, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { AppSetingsService } from 'src/app/services/app-settings.service';
 

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.scss'],
})
export class EncabezadoComponent implements OnInit {
@Input()titulo:any;
fecha = new Date().toLocaleDateString();
  constructor(
    public menuCtrl: MenuController,
    private plt:Platform,
    public appSettingsService: AppSetingsService
    
      ) {}

  ngOnInit() {}
  toggle(){
 this.appSettingsService.menu = !this.appSettingsService.menu ;
    this.menuCtrl.toggle('myMenu');
  
  }
}
