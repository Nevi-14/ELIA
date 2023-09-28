import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CrearEncuestaPageModule } from './pages/crear-encuesta/crear-encuesta.module';
 
const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Checkbox',
    pathMatch: 'full'
  },
  {
    path: 'calendario-popover',
    loadChildren: () => import('./pages/calendario-popover/calendario-popover.module').then( m => m.CalendarioPopoverPageModule)
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./pages/folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'detalle/:i',
    loadChildren: () => import('./pages/detalle/detalle.module').then( m => m.DetallePageModule)
  },
  {
    path: 'mapa',
    loadChildren: () => import('./pages/mapa/mapa.module').then( m => m.MapaPageModule)
  },
  {
    path: 'ruta',
    loadChildren: () => import('./pages/ruta/ruta.module').then( m => m.RutaPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'encuestas-preguntas',
    loadChildren: () => import('./pages/encuestas-preguntas/encuestas-preguntasmodule').then( m => m.EncuestasPreguntasPageModule)
  },
  {
    path: 'encuestas-clientes',
    loadChildren: () => import('./pages/encuestas-clientes/encuestas-clientes.module').then( m => m.EncuestasClientesPageModule)
  },

 
  {
    path: 'encuesta-lineas',
    loadChildren: () => import('./pages/encuesta-lineas/encuesta-lineas.module').then( m => m.EncuestaLineasPageModule)
  },
  {
    path: 'crear-encuesta',
    loadChildren: () => import('./pages/crear-encuesta/crear-encuesta.module').then( m => m.CrearEncuestaPageModule)
  },
  {
    path: 'crear-pregunta',
    loadChildren: () => import('./pages/crear-pregunta/crear-pregunta.module').then( m => m.CrearPreguntaPageModule)
  },
  {
    path: 'crear-encuesta-cliente',
    loadChildren: () => import('./pages/crear-encuesta-cliente/crear-encuesta-cliente.module').then( m => m.CrearEncuestaClientePageModule)
  },
  {
    path: 'editar-encuesta',
    loadChildren: () => import('./pages/editar-encuesta/editar-encuesta.module').then( m => m.EditarEncuestaPageModule)
  },
  {
    path: 'editar-pregunta',
    loadChildren: () => import('./pages/editar-pregunta/editar-pregunta.module').then( m => m.EditarPreguntaPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
