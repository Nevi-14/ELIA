import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EncuestasPreguntasPage } from './encuestas-preguntaspage';

const routes: Routes = [
  {
    path: '',
    component: EncuestasPreguntasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EncuestasPreguntasPageRoutingModule {}
