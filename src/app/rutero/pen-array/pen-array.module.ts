import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PenArrayPageRoutingModule } from './pen-array-routing.module';

import { PenArrayPage } from './pen-array.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PenArrayPageRoutingModule
  ],
  declarations: [PenArrayPage]
})
export class PenArrayPageModule {}
