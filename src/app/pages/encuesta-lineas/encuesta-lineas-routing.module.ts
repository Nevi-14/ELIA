import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EncuestaLineasPage } from './encuesta-lineas.page';

const routes: Routes = [
  {
    path: '',
    component: EncuestaLineasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EncuestaLineasPageRoutingModule {}
