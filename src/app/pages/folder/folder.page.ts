import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImaService } from 'src/app/services/ima.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string | any;
  textoBuscar = '';

  constructor(private activatedRoute: ActivatedRoute,
              public ima: ImaService,
              private router: Router ) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.ima.cargarClientes();
    //this.ima.cargarRutero( this.ima.id );
  }

  syncRuteroWeb(){
    if ( this.ima.logging ){ 
      console.log('Actualizando Rutero...');
      this.ima.syncRuteroWeb( this.ima.id );
    } else {
      this.ima.presentAlertW('Login', 'Debe haber un usuario registrado para mostrar la información...');
    }
  }

  abrirDetalle(i: number){
    if (this.ima.rutero[i].visitado === 10){
      this.router.navigate([`/detalle/${i}`]);
    }
  }

  onSearchChange(event:any){
    console.log(event.detail.value);
    this.textoBuscar = event.detail.value;
  }

}
