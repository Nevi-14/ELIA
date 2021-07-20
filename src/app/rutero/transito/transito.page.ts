import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Productos } from 'src/app/models/productos';
import { EliaService } from 'src/app/services/elia.service';
import { TareasService } from 'src/app/services/tareas.service';

@Component({
  selector: 'app-transito',
  templateUrl: './transito.page.html',
  styleUrls: ['./transito.page.scss'],
})
export class TransitoPage implements OnInit {

  @Input() stock: number;
  @Input() faltante: string;
  @Input() SKU: string;
  @Input() cliente: string;

  hayFaltante: boolean = false;
  hayBajoStock: boolean = false;
  justificacion: string = '';
  inventario: number = 0;

  constructor( private popoverCtrl: PopoverController,
               private tareas: TareasService,
               private elia: EliaService ) { }

  ngOnInit() {
    this.justificacion = this.faltante;
    if (this.stock === -1){
      this.hayFaltante = true;
    } else if (this.stock === 1){
      this.hayBajoStock = true;
    }
    this.cargarInventario( this.cliente );
  }

  async cargarInventario( idCliente: string ){
    let prod: Productos[] = [];
    let productos: Productos[] = [];

    prod = await this.elia.cargarProductos();
    productos = prod.filter( d => d.idCliente === idCliente && d.id === this.SKU );
    console.log( productos );
    this.inventario = productos[0].stock;
  }

  salvar(){
    if (this.hayFaltante && this.justificacion !== ''){
      this.popoverCtrl.dismiss({ nota: this.justificacion });
    } else if ( this.hayBajoStock && this.justificacion !== '' ){
      this.popoverCtrl.dismiss({ nota: this.justificacion });
    } else {
      this.tareas.presentAlertW('Faltante', 'Debe justificarse la razón del faltante o bajo stock.');
    }
  }

}
