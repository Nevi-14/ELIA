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
  },
  {
    path: 'resumen',
    loadChildren: () => import('./rutero/resumen/resumen.module').then( m => m.ResumenPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./configuracion/admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./configuracion/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'rutas',
    loadChildren: () => import('./configuracion/rutas/rutas.module').then( m => m.RutasPageModule)
  },
  {
    path: 'pen-array',
    loadChildren: () => import('./rutero/pen-array/pen-array.module').then( m => m.PenArrayPageModule)
  },
  {
    path: 'almuerzo',
    loadChildren: () => import('./rutero/almuerzo/almuerzo.module').then( m => m.AlmuerzoPageModule)
  },
  {
    path: 'check-out',
    loadChildren: () => import('./rutero/check-out/check-out.module').then( m => m.CheckOutPageModule)
  },
  {
    path: 'clientes',
    loadChildren: () => import('./configuracion/clientes/clientes.module').then( m => m.ClientesPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
