import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearEncuestaPage } from './crear-encuesta.page';

const routes: Routes = [
  {
    path: '',
    component: CrearEncuestaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearEncuestaPageRoutingModule {}
