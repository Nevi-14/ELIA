import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearEncuestaClientePageRoutingModule } from './crear-encuesta-cliente-routing.module';

import { CrearEncuestaClientePage } from './crear-encuesta-cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearEncuestaClientePageRoutingModule
  ],
  declarations: [CrearEncuestaClientePage]
})
export class CrearEncuestaClientePageModule {}
