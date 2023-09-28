import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarPreguntaPageRoutingModule } from './editar-pregunta-routing.module';

import { EditarPreguntaPage } from './editar-pregunta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarPreguntaPageRoutingModule
  ],
  declarations: [EditarPreguntaPage]
})
export class EditarPreguntaPageModule {}
