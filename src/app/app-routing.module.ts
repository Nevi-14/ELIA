import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'checkin',
    loadChildren: () => import('./rutero/checkin/checkin.module').then( m => m.CheckinPageModule)
  },
  {
    path: 'faltantes',
    loadChildren: () => import('./rutero/faltantes/faltantes.module').then( m => m.FaltantesPageModule)
  },
  {
    path: 'bodega',
    loadChildren: () => import('./rutero/bodega/bodega.module').then( m => m.BodegaPageModule)
  },
  {
    path: 'transito',
    loadChildren: () => import('./rutero/transito/transito.module').then( m => m.TransitoPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
