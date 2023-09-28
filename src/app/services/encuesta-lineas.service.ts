import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ImaEncuestasLinea } from '../models/imaEncuestasLinea';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncuestaLineasService {

  constructor(public http:HttpClient) { }

  private getISAURL( api: string, id: string ){
    let test: string = '';

    if ( !environment.prdMode ) {
      //test = environment.TestURL;
    }
    const URL = environment.preEXURL + test + environment.postEXURL + api + id;
    return URL;
  }
  private getEncuestasLineas( id: number){
    let URL = this.getISAURL( environment.getEncuestaLineas, '' );
        URL = URL+ id;
    console.log('URL', URL)
    return this.http.get<ImaEncuestasLinea[]>( URL );
  }
  private getLineas( ){
    let URL = this.getISAURL( environment.getEncuestasLineas, '' );
    console.log('URL', URL)
    return this.http.get<ImaEncuestasLinea[]>( URL );
  }
  private getEncuestasLinea( id: number, linea:number){
    let URL = this.getISAURL( environment.getEncuestaLinea, '' );
        URL = URL+id+ `&linea=${linea}`;
    console.log('URL', URL)
    return this.http.get<ImaEncuestasLinea[]>( URL );
  }
  private postEncuestaLinea( encuestaLinea: ImaEncuestasLinea ){
    const URL = this.getISAURL( environment.postEncuestaLinea, '' );
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
    };
    console.log(JSON.stringify(encuestaLinea));
    return this.http.post( URL, JSON.stringify(encuestaLinea), options );
  }

  private putEncuestaLinea( encuestaLinea: ImaEncuestasLinea ){
    let  URL = this.getISAURL( environment.postEncuestaLinea, '' );
         URL =  URL + encuestaLinea.iD_ENCUESTA;
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
    };
    console.log(JSON.stringify(encuestaLinea));
    return this.http.put( URL, JSON.stringify(encuestaLinea), options );
  }

  private deleteEncuestaLinea(id:number){
    let URL = this.getISAURL(environment.deleteEncuestaLinea,'');
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

  syncGetLineasToPromise(){

    return lastValueFrom(this.getLineas())
  }
  syncGetEncuestasLineasToPromise( id: number){
    return lastValueFrom(this.getEncuestasLineas(id));
  }
  syncGetEncuestasLineaToPromise( id: number,linea:number){
    return lastValueFrom(this.getEncuestasLinea(id,linea));
  }

  syncPostRespuestaEncuestaToPromise(encuestaLinea: ImaEncuestasLinea){
    return lastValueFrom(this.postEncuestaLinea(encuestaLinea));
  }
  syncPutRespuestaEncuestaToPromise(encuestaLinea: ImaEncuestasLinea){
    return lastValueFrom(this.putEncuestaLinea(encuestaLinea));
  }
  syncDeleteEncuestaLineaToPromise(id: number){
    return lastValueFrom( this.deleteEncuestaLinea(id));
  }
}
