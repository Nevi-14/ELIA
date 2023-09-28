import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearPreguntaPage } from './crear-pregunta.page';

const routes: Routes = [
  {
    path: '',
    component: CrearPreguntaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearPreguntaPageRoutingModule {}
