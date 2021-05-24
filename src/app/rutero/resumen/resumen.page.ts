import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PDV } from 'src/app/models/pdv';
import { TareasService } from 'src/app/services/tareas.service';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.page.html',
  styleUrls: ['./resumen.page.scss'],
})
export class ResumenPage implements OnInit {

  @Input() pdv: PDV;
  @Input() i: number;
  nombrePDV: string = '';

  constructor( private modalCtrl: ModalController,
               private tareas: TareasService  ) { }

  ngOnInit() {
    this.nombrePDV = this.pdv.nombre;
  }

  salir(){
    this.modalCtrl.dismiss({check: true});
  }

}
