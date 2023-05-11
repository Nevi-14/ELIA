import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormularioRespuestaPage } from './formulario-respuesta.page';

const routes: Routes = [
  {
    path: '',
    component: FormularioRespuestaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormularioRespuestaPageRoutingModule {}
