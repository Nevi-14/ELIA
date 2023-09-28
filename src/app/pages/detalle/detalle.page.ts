import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImaService } from 'src/app/services/ima.service';
import { DetalleVisita } from '../../models/rutero';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  i: number = 0;
  cliente: string = '';
  difHoras: number= 0;
  difMinutos: number= 0;
  difSegundos: number = 0;
  normal: boolean = true;
  bajoStock: boolean = true;
  stockOut: boolean = true;
  stockVence: boolean = true;
  detalle: DetalleVisita[] = [];
  cantLineas: number = 0;

  constructor( private activatedRoute: ActivatedRoute,
               public ima: ImaService ) { }

  ngOnInit() {
    let difMili: number;

    let param = this.activatedRoute.snapshot.paramMap.get('i');
    if(param){
      this.i = + param;
    }

    this.detalle = this.ima.rutero[this.i].detalle.slice(0);
    this.cantLineas = this.detalle.length;
    this.cliente = this.ima.rutero[this.i].nombre;
    difMili = Math.abs(new Date(this.ima.rutero[this.i].checkOut).getTime() - new Date(this.ima.rutero[this.i].checkIn).getTime());
    
    this.difSegundos = Math.floor(difMili / 1000);
    this.difHoras = Math.floor((this.difSegundos / 60) / 60);
    this.difMinutos = Math.floor(this.difSegundos / 60);
    if (this.difMinutos > 60){
      this.difMinutos = this.difMinutos - (this.difHoras * 60);
    }
    if (this.difSegundos > 60){
      this.difSegundos = this.difSegundos - (this.difMinutos * 60);
    }
  }

  cambiaQuery(){
    let temp: DetalleVisita[] = [];

    temp = this.ima.rutero[this.i].detalle.slice(0);
    this.detalle = [] = [];

    if ( !this.normal ){
      this.detalle = temp.filter(d => d.stock !== 0 || ( d.stock === 0 && d.cantidadVencen !== null));
      this.cantLineas = this.detalle.length;
    } else {
      this.detalle = temp.slice(0);
      this.cantLineas = this.detalle.length;
    }
    temp = this.detalle.slice(0);
    if ( !this.stockOut ){
      this.detalle = temp.filter(d => d.stock !== -1 || ( d.stock === -1 && d.cantidadVencen !== null));
      this.cantLineas = this.detalle.length;
    } else {
      this.detalle = temp.slice(0);
      this.cantLineas = this.detalle.length;
    }
    temp = this.detalle.slice(0);
    if ( !this.bajoStock ){
      this.detalle = temp.filter(d => d.stock !== 1 || ( d.stock === 1 && d.cantidadVencen !== null));
      this.cantLineas = this.detalle.length;
    } else {
      this.detalle = temp.slice(0);
      this.cantLineas = this.detalle.length;
    }
    temp = this.detalle.slice(0);
    if ( !this.stockVence ){
      this.detalle = temp.filter(d => d.cantidadVencen !== 0);
      this.cantLineas = this.detalle.length;
    } else {
      this.detalle = temp.slice(0);
      this.cantLineas = this.detalle.length;
    }
  }

}
