import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, NavParams } from '@ionic/angular';

import { FaltantesPageRoutingModule } from './faltantes-routing.module';

import { FaltantesPage } from './faltantes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaltantesPageRoutingModule
  ],
  declarations: [FaltantesPage],
  providers: [NavParams]
})
export class FaltantesPageModule {}
