import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { PDV, PDVS } from '../models/pdv';
import { Productos } from '../models/productos';
import { Ruta } from '../models/ruta';
import { VisitaDiaria } from '../models/rutero';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  pdvActivo: PDV;
  productos: Productos[] = [];
  faltantes: Productos[] = [];
  pdvs: PDV[] = [];
  rutero: VisitaDiaria[] = [];

  varConfig: Ruta = {
    ruta: 'RU01',
    handHeld: 'HH01',
    compania: 'ISLEÑA',
    bodega: 1,
    agente: 'Mauricio Herra',
    email: 'mauricio.herra@gmail.com',
  }

  constructor( private alertController: AlertController ) {
    this.pdvs = PDVS.slice(0);
  }

  cargarRutero(){
    let visita: VisitaDiaria;

    if (localStorage.getItem('visitaDiaria')){
      this.rutero = JSON.parse(localStorage.getItem('visitaDiaria'));
    } else {
      const dia = new Date().getDay();
      this.pdvs.forEach( d => {
        if (d.diasVisita[dia] === 'X'){
          visita = new VisitaDiaria( d.id, d.nombre, d.horaVisita,'', '', this.varConfig.agente );
          this.rutero.push(visita);
        }
      });
    }
  }

  cargarVisitaAnterior( idPDV: string, i: number ){
    let visitaAnterior: VisitaDiaria[] = [];
    let visitaLS: VisitaDiaria[] = [];

    if (localStorage.getItem('visitaAnterior')){
      visitaLS = JSON.parse(localStorage.getItem('visitaDiaria'));
      visitaAnterior = visitaLS.filter( d => d.idPDV === idPDV );
      if (visitaAnterior.length > 0){
        this.rutero[i].detalle = visitaAnterior[0].detalle.slice(0);
      }
    }
  }

  async presentAlertW( subtitulo: string, mensaje: string ) {
    const alert = await this.alertController.create({
      header: 'Warning',
      subHeader: subtitulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  guardarFaltantes(){
    let faltantesLS: Productos[] = [];
    let faltantesTemp: Productos[] = [];

    if (localStorage.getItem('faltantes')){
      faltantesLS = JSON.parse(localStorage.getItem('faltantes'));
      faltantesTemp = faltantesLS.concat(this.faltantes);
      localStorage.setItem('faltantes', JSON.stringify(faltantesTemp));
    } else {
      localStorage.setItem('faltantes', JSON.stringify(this.faltantes));
    }
  }

}
