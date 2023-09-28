import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestaLineasPageRoutingModule } from './encuesta-lineas-routing.module';

import { EncuestaLineasPage } from './encuesta-lineas.page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuestaLineasPageRoutingModule,
    PipesModule
  ],
  declarations: [EncuestaLineasPage]
})
export class EncuestaLineasPageModule {}
