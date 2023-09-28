import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarEncuestaPageRoutingModule } from './editar-encuesta-routing.module';

import { EditarEncuestaPage } from './editar-encuesta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarEncuestaPageRoutingModule
  ],
  declarations: [EditarEncuestaPage]
})
export class EditarEncuestaPageModule {}
