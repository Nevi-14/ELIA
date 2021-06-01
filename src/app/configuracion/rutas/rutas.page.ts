import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Ruta } from 'src/app/models/ruta';
import { TareasService } from 'src/app/services/tareas.service';

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.page.html',
  styleUrls: ['./rutas.page.scss'],
})
export class RutasPage implements OnInit {

  rutas: Ruta[] = [];

  constructor( private tareas: TareasService,
               private popoverCtrl: PopoverController ) { }

  ngOnInit() {
    this.rutas = this.tareas.rutas.slice(0);
  }

  rutaSeleccionada( i: number ){
    this.popoverCtrl.dismiss({
      indice: i
    });
  }

}
