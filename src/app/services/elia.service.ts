
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Ruta } from '../models/ruta';

@Injectable({
  providedIn: 'root'
})
export class EliaService {

  constructor( private http: HttpClient ) { }

  getURL( api: string, id: string ){
    let test: string = '';

    if ( !environment .prdMode ) {
      test = environment.TestURL;
    }
    const URL = environment.preURL + test + environment.postURL + api + id;
    console.log(URL);
    return URL;
  }

  getRutas(){
    const URL = this.getURL( environment.rutasURL, '' );
    return this.http.get<Ruta[]>( URL );
  }
}
