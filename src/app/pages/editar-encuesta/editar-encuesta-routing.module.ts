import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarEncuestaPage } from './editar-encuesta.page';

const routes: Routes = [
  {
    path: '',
    component: EditarEncuestaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarEncuestaPageRoutingModule {}
