import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EncuestasClienteVista } from '../models/encuestasClienteVista';
import { ImaEncuestas } from '../models/imaEncuestas';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncuestasService {
  encuestasClienteVista: EncuestasClienteVista[] = [];
  encuestas: ImaEncuestas[] = [];
  constructor(
    private http: HttpClient
  ) { }


  private getISAURL(api: string, id: string) {
    let test: string = '';

    if (!environment.prdMode) {
      //test = environment.TestURL;
    }
    const URL = environment.preEXURL + test + environment.postEXURL + api + id;
    return URL;
  }

  // Vista  Clientes 

  private getEncuestasClienteVista(idCliente: string) {
    const URL = this.getISAURL(environment.getEncuetasClienteVista, idCliente);
    console.log('URL', URL)
    return this.http.get<EncuestasClienteVista[]>(URL);
  }
  private getEncuestaClientesVista() {
    const URL = this.getISAURL(environment.getEncuetaClientesVista, '');
    console.log('URL', URL)
    return this.http.get<EncuestasClienteVista[]>(URL);
  }
  private getEncuestasClientesVista(id: string, linea:number) {
    let URL = this.getISAURL(environment.getEncuestasClientesVista, id);
        URL = URL + `&linea=${linea}`
    console.log('URL', URL)
    return this.http.get<EncuestasClienteVista[]>(URL);
  }
  private getEncuestas() {
    let URL = this.getISAURL(environment.getEncuestas, '');
    console.log('URL', URL)
    return this.http.get<ImaEncuestas[]>(URL);
  }
  private postEncuesta(encuesta: ImaEncuestas) {
    const URL = this.getISAURL(environment.postEncuesta, '');
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    console.log(JSON.stringify(encuesta));
    return this.http.post(URL, JSON.stringify(encuesta), options);
  }
  private putEncuesta(encuesta: ImaEncuestas) {
    let URL = this.getISAURL(environment.putEncuesta, '');
        URL = URL + encuesta.id;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    console.log(JSON.stringify(encuesta));
    return this.http.put(URL, JSON.stringify(encuesta), options);
  }

  private deleteEncuesta(id: number) {
    let URL = this.getISAURL(environment.deleteEncuesta, '');
    URL = URL + id;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
    return this.http.delete(URL, options);
  }
   
  syncGetEncuestaClientesVista() {
    return lastValueFrom(this.getEncuestaClientesVista())
  }

  syncGetEncuestasClienteVista(idCliente: string) {
    return lastValueFrom(this.getEncuestasClienteVista(idCliente))
  }

 

    syncGetEncuestasClientesVistToPromise(id: string, linea:number) {
      return  lastValueFrom(this.getEncuestasClientesVista(id,linea))
    }
  
  syncGetEncuestasToPromise() {
    return  lastValueFrom(this.getEncuestas())
  }

  syncPostEncuestaToPromise(encuesta: ImaEncuestas) {
    return lastValueFrom(this.postEncuesta(encuesta));
  }
  syncPutEncuestaToPromise(encuesta: ImaEncuestas) {
    return lastValueFrom(this.putEncuesta(encuesta));
  }
  syncDeleteEncuestaToPromise(id: number) {
    return lastValueFrom(this.deleteEncuesta(id));
  }
}
