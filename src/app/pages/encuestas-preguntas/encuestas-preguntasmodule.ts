import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestasPreguntasPageRoutingModule } from './encuestas-preguntas-routing.module';

import { EncuestasPreguntasPage } from './encuestas-preguntaspage';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuestasPreguntasPageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [EncuestasPreguntasPage]
})
export class EncuestasPreguntasPageModule {}
