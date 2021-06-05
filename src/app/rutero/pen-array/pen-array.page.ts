import { Component, Input, OnInit } from '@angular/core';
import { Productos } from 'src/app/models/productos';

@Component({
  selector: 'app-pen-array',
  templateUrl: './pen-array.page.html',
  styleUrls: ['./pen-array.page.scss'],
})
export class PenArrayPage implements OnInit {

  @Input() pendientes: Productos[];
  productos: Productos[] = [];

  constructor() { }

  ngOnInit() {
    this.productos = this.pendientes.slice(0);
  }

}
