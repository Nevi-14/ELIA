import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormularioRespuestaPageRoutingModule } from './formulario-respuesta-routing.module';

import { FormularioRespuestaPage } from './formulario-respuesta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormularioRespuestaPageRoutingModule
  ],
  declarations: [FormularioRespuestaPage]
})
export class FormularioRespuestaPageModule {}
