import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FaltantesPage } from './faltantes.page';

const routes: Routes = [
  {
    path: '',
    component: FaltantesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaltantesPageRoutingModule {}
