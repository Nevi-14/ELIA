import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestasClientesPageRoutingModule } from './encuestas-clientes-routing.module';

import { EncuestasClientesPage } from './encuestas-clientes.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuestasClientesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EncuestasClientesPage]
})
export class EncuestasClientesPageModule {}
