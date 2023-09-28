import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RespuestasEncuestas } from '../models/respuestasEncuestas';
 
@Injectable({
  providedIn: 'root'
})
export class RespuestasEncuestasService {
  respuestas:RespuestasEncuestas[]=[];
visita:any | any;
  constructor(
    private http: HttpClient   
  ) { }


  private getISAURL( api: string, id: string ){
    let test: string = '';

    if ( !environment .prdMode ) {
      //test = environment.TestURL;
    }
    const URL = environment.preEXURL + test + environment.postEXURL + api + id;
    return URL;
  }
  private getRespuestasEncuestas( id: string, linea:number ){
    let URL = this.getISAURL( environment.getRespuestasEncuestaLinea, id );
        URL = URL+ `&linea=${linea}`;
    console.log('URL', URL)
    return this.http.get<RespuestasEncuestas[]>( URL );
  }
  private postRespuestaEncuesta( respuestaEncuesta: RespuestasEncuestas ){
    const URL = this.getISAURL( environment.postRespuestaEncuestaLinea, '' );
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
    };
    console.log(JSON.stringify(respuestaEncuesta));
    return this.http.post( URL, JSON.stringify(respuestaEncuesta), options );
  }

  private deleteRespuestaEncuesta(id:number){
    let URL = this.getISAURL(environment.deleteRespuestaEncuestaLinea,'');
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
  
  syncGetRespuestasEncuestasToPromise( id: string, linea:number ){
    return this.getRespuestasEncuestas(id,linea).toPromise();
  }

  syncPostRespuestaEncuestaToPromise(respuestaEncuesta: RespuestasEncuestas){
    return this.postRespuestaEncuesta(respuestaEncuesta).toPromise();
  }
  syncDeleteRespuestaEncuestaToPromise(id: number){
    return this.deleteRespuestaEncuesta(id).toPromise();
  }
}
