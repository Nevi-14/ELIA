import { Component, Input, OnInit } from '@angular/core';
import { EncuestasClienteVista } from 'src/app/models/encuestasClienteVista';
import { VisitaDiaria } from 'src/app/models/rutero';
import { EncuestasService } from 'src/app/services/encuestas.service';

@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.page.html',
  styleUrls: ['./encuestas.page.scss'],
})
export class EncuestasPage implements OnInit {
encuestas:EncuestasClienteVista[]=[];
@Input() visita:VisitaDiaria
  constructor(
 public encuestasService:EncuestasService   
  ) { }

  ngOnInit() {
    this.encuestasService.syncGetEncuestasClienteVista(this.visita.idPDV).then( encuestas =>{
      this.encuestas = encuestas;
    }, error =>{
      console.log('error', error)
    })
  }

}
