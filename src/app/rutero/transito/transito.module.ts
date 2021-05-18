import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransitoPageRoutingModule } from './transito-routing.module';

import { TransitoPage } from './transito.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransitoPageRoutingModule
  ],
  declarations: [TransitoPage]
})
export class TransitoPageModule {}
