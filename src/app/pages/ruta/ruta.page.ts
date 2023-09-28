import { Component, OnInit } from '@angular/core';
import { Visita } from 'src/app/models/ruta';
import { ImaService } from 'src/app/services/ima.service';

@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.page.html',
  styleUrls: ['./ruta.page.scss'],
})
export class RutaPage implements OnInit {

  visitas: Visita[] = [];

  constructor( public ima: ImaService) { }

  ngOnInit() {
    console.log('ID: ', this.ima.id);
    if ( this.ima.visitas.length === 0){
      this.ima.syncVisitaDiaria( this.ima.id );
    }
  }

  syncVisitas(){
    this.ima.syncVisitaDiaria( this.ima.id );
  }

}
