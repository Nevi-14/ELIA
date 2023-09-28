import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarPreguntaPage } from './editar-pregunta.page';

const routes: Routes = [
  {
    path: '',
    component: EditarPreguntaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarPreguntaPageRoutingModule {}
