import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AlertasService } from './alertas.service';
interface array {
  Cadena:string,
  ID:number,
  idCliente:number,
  nombre:string,
  precio:number,
  codigoBarras:string,
  stockMinimo: number,
  idProduc: string
  
  }
@Injectable({
  providedIn: 'root'
})
export class ImportarProductosDBService {
productosArray:array [][] =[];
productsUploaded = 0;
page:number = 0;
total:number = 0;
fileName = '';
  constructor(
public http: HttpClient,
public alertasService:AlertasService

  ) { }
  
  getURL( api: string){
    let test: string = ''
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }
    const URL = environment.preEXURL  + test +  environment.postEXURL + api;
    return URL;
  }
  private postProductos (productos:array[]){
    const URL = this.getURL( environment.IMA_ProdTiendaURL );
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
    };
   
    return this.http.post( URL, JSON.stringify(productos), options );
  }

  
  insertarProductos(productos:array[]){

    this.alertasService.presentaLoading('Guargando productos');


    this.postProductos(productos).subscribe(

    
      resp => {

        this.alertasService.loadingDissmiss();
      

      }, error => {

        this.alertasService.loadingDissmiss();

    

       console.log('error')
      }
    )

  }

  

  async promisePostProductos(productos:array[]){
   // console.log(productos)
  return  this.postProductos(productos).toPromise();


 
   }
 
   paginarArreglo (arr:any[], size:number) {
    return arr.reduce((acc, val, i) => {

      let idx = Math.floor(i / size)
      let page = acc[idx] || (acc[idx] = [])
      page.push(val)
      return acc
    }, [])
  }


  async insertarProductosPromesa(productos:any[], total:number) {
    for (let i = 0; i < productos.length; i++) {
      this.alertasService.presentaLoading('Guargando productos' + this.productsUploaded +' de ' +total);

      await this.promisePostProductos(productos[i]).then(resp =>{
        this.alertasService.loadingDissmiss();
        console.log('productos guardados', productos[i].length)
        this.productsUploaded += productos[i].length
      }, error =>{
        this.alertasService.loadingDissmiss();
        console.log('error guardando productos', error, productos)
      });

      if(i == productos.length -1){
        this.productosArray = [];
        this.total = 0;
        this.page = 0;
        this.fileName = '';
        this.alertasService.message('IMA','Un total de '+ this.productsUploaded+' productos guardados!.')
        this.productsUploaded = 0;
      }
    
    }
 
  };
 


  private   borrarProductos(KEY:any ){
  

    let URL = this.getURL( environment.IMA_ProdTiendaURL);
        URL = URL + KEY;
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }

      
    };
   
 
    return this.http.delete( URL, options );
  }
  
  
  
  syncBorrarProductos(KEY:any  ){

    this.alertasService.presentaLoading('Borrando productos');

    this.borrarProductos( KEY ).subscribe(
      resp => {
            
        this.alertasService.loadingDissmiss();
       console.log(KEY, 'productos deleted')
      }, error => {
        this.alertasService.loadingDissmiss();
        console.log('error')
      }
    )
  }


}
