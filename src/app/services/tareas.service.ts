import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { PDV } from '../models/pdv';
import { Productos } from '../models/productos';
import { Ruta } from '../models/ruta';
import { VisitaDiaria } from '../models/rutero';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  pdvActivo: PDV;
  faltantes: Productos[] = [];
  pdvs: PDV[] = [];
  rutero: VisitaDiaria[] = [];
  rutas: Ruta[] = [];
  loading: HTMLIonLoadingElement;

  varConfig: Ruta = {
    ruta: 'ME00',
    handHeld: 'HH00',
    bodega: 'ND',
    agente: 'ND',
    pedido: '',
    devolucion: ''
  }

  constructor( private alertController: AlertController,
               private loadingCtrl: LoadingController,
               private toastCtrl: ToastController ) {
    this.cargarVarConfig();
  }

  cargarVarConfig(){
    if (localStorage.getItem('IMAconfig')){
      this.varConfig = JSON.parse( localStorage.getItem('IMAconfig'));
    } 
  }

  guardarVarConfig(){
    localStorage.setItem('IMAconfig', JSON.stringify(this.varConfig));
  }

  cargarClientes(){
    if (localStorage.getItem('IMAclientes')){
      this.pdvs = JSON.parse(localStorage.getItem('IMAclientes'));
    }
  }
  
  cargarRutero(){
    let visita: VisitaDiaria;

    if (localStorage.getItem('visitaDiaria')){
      this.rutero = JSON.parse(localStorage.getItem('visitaDiaria'));
    } else {
      const dia = (new Date().getDay()) - 1;
      this.pdvs.forEach( d => {
        if (d.diasVisita[dia] === 'X'){
          visita = new VisitaDiaria( d.id, d.nombre, d.horaVisita, 0, 0, this.varConfig.agente, d.orden );
          this.rutero.push(visita);
        }
      });
      this.rutero.sort(function(a,b){return a.orden - b.orden;});
      this.guardarVisitas();
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

  guardarVisitas(){
    localStorage.setItem('visitaDiaria', JSON.stringify(this.rutero));
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

  async presentaLoading( mensaje: string ){
    this.loading = await this.loadingCtrl.create({
      message: mensaje,
    });
    await this.loading.present();
  }

  loadingDissmiss(){
    this.loading.dismiss();
  }

  async presentaToast ( message ){
    const toast = await this.toastCtrl.create({
      message,
      duration: 3500
    });
    toast.present();
  }

}
