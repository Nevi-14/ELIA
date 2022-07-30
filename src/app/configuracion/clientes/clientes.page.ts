import { Component, OnInit } from '@angular/core';
import { TareasService } from '../../services/tareas.service';
import { ModalController, AlertController } from '@ionic/angular';
import { ClientesBD, PDV } from '../../models/pdv';
import { EliaService } from '../../services/elia.service';
import { VisitaDiaria } from '../../models/rutero';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {

  clientes: ClientesBD[] = [];
  textoBuscar: string = '';

  constructor( private tareas: TareasService,
               private modalCtrl: ModalController,
               private alertCtrl: AlertController,
               private elia: EliaService ) { }

  ngOnInit() {
    this.elia.getClientesIMA().subscribe(
      resp => {
        this.clientes = resp.slice(0);
      }, error => {
        console.log(error);
      }
    )
  }

  onSearchChange(event){
    this.textoBuscar = event.detail.value;
  }

  async seleccion( cliente: ClientesBD ){
    console.log(cliente);
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirmación',
      message: `Desea agregar el cliente código ${cliente.cod_Clt} a la ruta de hoy?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            console.log('Confirm Okay');
            this.agregarCliente(cliente);
          }
        }
      ]
    });

    await alert.present();
  }

  agregarCliente( cliente: ClientesBD ){
    let clientes: PDV[] = [];

    const fecha = new Date();
    const item = new VisitaDiaria( cliente.cod_Clt, cliente.nom_Clt, '', null, null, this.tareas.varConfig.idMercarista, this.tareas.rutero.length + 1);
    item.ID = this.elia.getID(fecha);
    item.agregado = true;
    this.tareas.rutero.push(item);
    const pdv = new PDV(cliente.cod_Clt, cliente.nom_Clt, cliente.dir_Clt, cliente.nom_Cto, cliente.num_Tel, '-------', '', cliente.latitud, cliente.longitud, cliente.codigo_WM);
    if (localStorage.getItem('ELIAclientes')){
      clientes = JSON.parse(localStorage.getItem('ELIAclientes'));
    }
    clientes.push(pdv);
    localStorage.setItem('ELIAclientes', JSON.stringify(clientes));
    this.tareas.cargarClientes();
    this.elia.syncProductos(pdv.idWM, 1, 2, true);
    // this.modalCtrl.dismiss({check: true});
  }

  salir(){
    this.modalCtrl.dismiss({check: false});
  }

}
