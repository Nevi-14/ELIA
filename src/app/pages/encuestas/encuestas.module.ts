import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestasPageRoutingModule } from './encuestas-routing.module';

import { EncuestasPage } from './encuestas.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuestasPageRoutingModule,
    ComponentModule
  ],
  declarations: [EncuestasPage]
})
export class EncuestasPageModule {}
