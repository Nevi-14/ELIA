import { Component, Input, OnInit } from '@angular/core';
import { TareasService } from 'src/app/services/tareas.service';
import * as countdown from 'countdown';
import { ModalController } from '@ionic/angular';


interface Time {
  minutes: number,
  seconds: number,
}

@Component({
  selector: 'app-almuerzo',
  templateUrl: './almuerzo.page.html',
  styleUrls: ['./almuerzo.page.scss'],
})
export class AlmuerzoPage implements OnInit {

  @Input() crono: number;
  horaFin: Date;
  horaActual: Date;
  time: Time = null;
  timerId: number = null;

  constructor( private tareas: TareasService,
               private modalCtrl: ModalController ) { }

  ngOnInit() {
    console.log(this.tareas.varConfig.horaAlmuerzo);
    this.horaFin = new Date(new Date(this.tareas.varConfig.horaAlmuerzo).getTime() + (new Date(this.tareas.varConfig.horaAlmuerzo).getTimezoneOffset() * 10000));
    this.horaActual = new Date();
    if (this.horaFin > this.horaActual) {
      console.log( countdown( this.horaActual, this.horaFin ).toString());
      this.timerId = countdown(this.horaFin, (ts)=>{
        this.time = ts;
        console.log(ts);
        if (this.time.minutes === 0 && this.time.seconds === 0) {
          this.tareas.varConfig.almuerzoTime = false;
        }
      }, countdown.MINUTES | countdown.SECONDS);
    } else {
      console.log('El tiempo de Almuerzo acabó...');
      this.regresar();
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.timerId){
      clearInterval(this.timerId);
    }
  }

  regresar(){
    this.tareas.varConfig.almuerzoTime = false;
    this.tareas.guardarVarConfig();
    this.modalCtrl.dismiss();
  }

}
