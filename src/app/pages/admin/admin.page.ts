import { Component, OnInit } from '@angular/core';
import { ImaService } from 'src/app/services/ima.service';
import { ClientesBD } from '../../models/clientes';
import * as XLSX from 'xlsx';  // Convierte excel a objeto // npm i xlsx
import { AlertasService } from 'src/app/services/alertas.service';
import { ImportarProductosDBService } from 'src/app/services/importar-productos-db.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  clientesISA: ClientesBD[] = [];
  clientesIMA: ClientesBD[] = [];
  pendientes:  ClientesBD[] = [];
  conError:    ClientesBD[] = [];
  cantidad:    number = 0;
  actualizar:  boolean = false;
  actualizando: boolean = false;
  avance:      number = 0;
  mostrarProductos:boolean = false;
  mostrarPendientes:boolean = true;
  textoBuscar = '';
  constructor( 
    
    private ima: ImaService,
    public alertasService:AlertasService,
    public importarProductosDBService:ImportarProductosDBService
    
    
    ) { }

  ngOnInit() {
  }

  syncClientes(){
    this.actualizando = false;
    this.mostrarProductos = false;
    this.mostrarPendientes = true;
    this.ima.getISAClientes().subscribe(
      resp => {
        console.log('Se cargaron los Clientes de Softland', resp);
        this.clientesISA = resp.slice(0);
        this.cargarClientesIMA();
      }
    )
  }

  cargarClientesIMA(){
    this.ima.getIMAClientes().subscribe(
      resp => {
        console.log('Se cargaron los Clientes de Mercaderistas', resp);
        this.clientesIMA = resp.slice(0);
        this.mostrarClientes();
      }
    )
  }

  prev(page:number){

   this.importarProductosDBService.page =  page <= 0 ? 0: page -1;

this.importarProductosDBService.productosArray[this.importarProductosDBService.page]
  }

  next(page:number){
  
    this.importarProductosDBService.page =  page+1 == this.importarProductosDBService.productosArray.length ?  this.importarProductosDBService.productosArray.length -1 : page+1;
    this.importarProductosDBService.productosArray[this.importarProductosDBService.page]
  }


  mostrarClientes(){
    let i: number;
    this.pendientes = [];
    this.conError = [];

    this.clientesISA.forEach( x => {
      i = this.clientesIMA.findIndex( y => y.cod_Clt === x.cod_Clt);
      if ( i === -1 ){
        this.pendientes.push(x);
      }
    });
    console.log('Diferencia: ', this.pendientes);
    this.cantidad = this.pendientes.length;
    this.actualizar = true;
    this.actualizando = false;
  }

  cargarDatos(){
    if ( this.cantidad > 0 ){ 
      this.actualizando = true;
      const promedio = 100 / this.cantidad;
      this.pendientes.forEach( x => {
        this.ima.postClientes(x).subscribe(
          resp => {
            this.avance += promedio;
            console.log(x);
          }, error => {
            this.avance += promedio;
            this.conError.push(x);
          }
        );
      });
      this.actualizar = false;
    } else {
      this.ima.presentAlertW('Carga de Datos', 'No hay clientes que cargar en la base de datos de Mercaderistas...');
    }
  }

  postProductos(){
    this.importarProductosDBService.insertarProductosPromesa(this.importarProductosDBService.productosArray, this.importarProductosDBService.total);
  }
  syncProductos(){
    this.importarProductosDBService.fileName = '';
    this.pendientes = [];
    this.conError = [];
    this.actualizar = false;
    this.mostrarProductos = true;
    this.mostrarPendientes = false;


  }
  onSearchChange(event:any){


    this.textoBuscar = event.detail.value;
  }
    // INSTALAR npm install xlsx --save para trabajr excel como un objeto

    fileUpload($event:any){
      this.importarProductosDBService.productosArray = [];
    //console.log(event.target.files)
    const selectedFile = $event.target.files[0];
    this.importarProductosDBService.fileName = selectedFile.name;

this.alertasService.presentaLoading('Cargado datos..')


    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event:any) =>{
      //console.log(event);
   
      let binaryData = event.target.result;
      //  EL METODO READ TIENE DOS PARAMETROS 1 EL BINARY DATA Y EL TIPO
      let workbook = XLSX.read(binaryData, {type:'binary'});

      workbook.SheetNames.forEach((sheet:any)  =>{
const data:any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
this.importarProductosDBService.total = data.length;
let productos = this.importarProductosDBService.paginarArreglo(data, 500);
this.importarProductosDBService.productosArray = productos;


this.alertasService.loadingDissmiss();


      });
      //console.log(workbook)

    }
  }

}
