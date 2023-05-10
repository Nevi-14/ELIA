import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestasPageRoutingModule } from './encuestas-routing.module';

import { EncuestasPage } from './encuestas.page';
import { ComponentModule } from 'src/app/components/component.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuestasPageRoutingModule,
    ComponentModule,
    PipesModule
  ],
  declarations: [EncuestasPage]
})
export class EncuestasPageModule {}
