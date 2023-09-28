import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ImaEncuestasClientes } from '../models/imaEncuestasClientes';

@Injectable({
  providedIn: 'root'
})
export class EncuestaClientesService {

  constructor(public http:HttpClient) { }

  private getISAURL( api: string, id: string ){
    let test: string = '';

    if ( !environment .prdMode ) {
      //test = environment.TestURL;
    }
    const URL = environment.preEXURL + test + environment.postEXURL + api + id;
    return URL;
  }
  private getEncuestasClientes(){
    let URL = this.getISAURL( environment.getEncuestasClientes, '' );
    console.log('URL', URL)
    return this.http.get<ImaEncuestasClientes[]>( URL );
  }
  private getEncuestasCliente(id:number){
    let URL = this.getISAURL( environment.getEncuestasCliente, '' );
        URL = URL + id;
    console.log('URL', URL)
    return this.http.get<ImaEncuestasClientes[]>( URL );
  }
  private postEncuestaCliente( encuestaCliente: ImaEncuestasClientes ){
    const URL = this.getISAURL( environment.postEncuestaCliente, '' );
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
    };
    console.log(JSON.stringify(encuestaCliente));
    return this.http.post( URL, JSON.stringify(encuestaCliente), options );
  }


  private putEncuestaCliente( encuestaCliente: ImaEncuestasClientes ){
    let URL = this.getISAURL( environment.putEncuestaCliente, '' );
        URL =  URL + encuestaCliente.id;
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
    };
    console.log(JSON.stringify(encuestaCliente));
    return this.http.put( URL, JSON.stringify(encuestaCliente), options );
  }

  private deleteEncuestaCliente(id:number){
    let URL = this.getISAURL(environment.deleteEncuestaCliente,'');
        URL = URL + id;
        const options = {
          headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
    return this.http.delete(URL,options);
  }
  
  syncGetEncuestasClientesToPromise( ){
    return this.getEncuestasClientes().toPromise();
  }
  syncGetEncuestasClienteToPromise( id: number ){
    return this.getEncuestasCliente(id).toPromise();
  }
  syncPostEncuestaClienteToPromise(encuestaCliente: ImaEncuestasClientes ){
    return this.postEncuestaCliente(encuestaCliente).toPromise();
  }
  syncPutEncuestaClienteToPromise(encuestaCliente: ImaEncuestasClientes ){
    return this.putEncuestaCliente(encuestaCliente).toPromise();
  }
  syncDeleteEncuestaClienteToPromise(id: number){
    return this.deleteEncuestaCliente(id).toPromise();
  }
}
