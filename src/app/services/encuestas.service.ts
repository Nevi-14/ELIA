import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EncuestasClienteVista } from '../models/encuestasClienteVista';

@Injectable({
  providedIn: 'root'
})
export class EncuestasService {

  constructor(
    private http: HttpClient    
  ) { }


  private getISAURL( api: string, id: string ){
    let test: string = '';

    if ( !environment .prdMode ) {
      //test = environment.TestURL;
    }
    const URL = environment.preURL + test + environment.postURL + api + id;
    return URL;
  }
  private getEncuestasClienteVista( idCliente: string ){
    const URL = this.getISAURL( environment.getEncuetasClienteVista, idCliente );
    console.log('URL', URL)
    return this.http.get<EncuestasClienteVista[]>( URL );
  }

  
  syncGetEncuestasClienteVista(idCliente:string){
    return this.getEncuestasClienteVista(idCliente).toPromise();
  }
}
