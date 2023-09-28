import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { RutasUbicadas } from 'src/app/models/ruta';
import { ImaService } from 'src/app/services/ima.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  rutas: RutasUbicadas[] = [];
  mapa: mapboxgl.Map | any;
  marcadores: mapboxgl.Marker[] = [];
  listaActiva: boolean = true;

  constructor( private ima: ImaService) { }

  ngOnInit() {
    (mapboxgl as any).accessToken = environment.tokenMaps;

    this.cargarRutas();

    this.mapa = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [ -84.14123589305028, 9.982628288210657 ],
      zoom: 16,

    });

    this.ponerMarcas();

    this.mapa.on('load', () => {
      setTimeout(() => this.mapa.resize(), 0);
    });
  }

  cambiaLista(){
    if ( this.listaActiva ){
      this.listaActiva = false;
    } else {
      this.listaActiva = true;
    }
  }

  cargarRutas() {
    let ruta = '';
    let item: RutasUbicadas;

    this.ima.rutero.forEach( d => {
      if (d.visitado > 0) {
        item = new RutasUbicadas( d.ruta, d.orden, d.latitud, d.longitud, d.nombre );
        this.rutas.push(item);
        ruta = d.ruta;
      }});
  }

  ponerMarcas(){
    let marcador: mapboxgl.Marker;

    this.rutas.forEach( d => {
      marcador = new mapboxgl.Marker()
        .setLngLat( [ d.longitud, d.latitud ] )
        .addTo( this.mapa );
      this.marcadores.push( marcador );
    });
  }

  irMarcador( i: number ){
    this.mapa.flyTo({
      center: [ this.rutas[i].longitud, this.rutas[i].latitud ],
      zoom: 16,
    });
  }

}
