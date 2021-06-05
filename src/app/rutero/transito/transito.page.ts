import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TareasService } from 'src/app/services/tareas.service';

@Component({
  selector: 'app-transito',
  templateUrl: './transito.page.html',
  styleUrls: ['./transito.page.scss'],
})
export class TransitoPage implements OnInit {

  @Input() stock: number;
  @Input() faltante: string;

  hayFaltante: boolean = false;
  justificacion: string = '';

  constructor( private popoverCtrl: PopoverController,
               private tareas: TareasService ) { }

  ngOnInit() {
    if (this.stock === -1){
      this.hayFaltante = true;
      this.justificacion = this.faltante;
    }
  }

  salvar(){
    if (this.hayFaltante && this.justificacion !== ''){
      this.popoverCtrl.dismiss({ nota: this.justificacion });
    } else if ( !this.hayFaltante ){
      this.popoverCtrl.dismiss({ nota: '' });
    } else {
      this.tareas.presentAlertW('Faltante', 'Debe justificarse la razón del faltante.');
    }
  }

}
