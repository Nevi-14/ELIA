import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PenArrayPage } from './pen-array.page';

const routes: Routes = [
  {
    path: '',
    component: PenArrayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PenArrayPageRoutingModule {}
