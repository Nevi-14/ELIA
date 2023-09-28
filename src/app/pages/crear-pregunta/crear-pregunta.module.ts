import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearPreguntaPageRoutingModule } from './crear-pregunta-routing.module';

import { CrearPreguntaPage } from './crear-pregunta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearPreguntaPageRoutingModule
  ],
  declarations: [CrearPreguntaPage]
})
export class CrearPreguntaPageModule {}
