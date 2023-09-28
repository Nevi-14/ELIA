import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearEncuestaClientePage } from './crear-encuesta-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: CrearEncuestaClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearEncuestaClientePageRoutingModule {}
