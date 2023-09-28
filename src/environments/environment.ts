// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  prdMode: true,
  adminClave: '123456',
  preEXURL: 'http://api_isa',
  TestURL: '_test',
  postEXURL: '.di-apps.co.cr/api/',
  IMAURL: 'http://mercaderistas.di-apps.co.cr/api/',
  ISAURL: 'http://api_isa.di-apps.co.cr/api/',
  rutasURL: 'IMA_Rutas/',
  clientesISAURL: 'IMA_Clientes/',
  clientesIMAURL: 'Clientes/',
  rolVisitaURL: 'IMA_Visitas/',
  productosURL: 'productos/',
  ruteroPostURL: 'Rutero/',
  detalleRutURL: 'RuteroDet/',
  usersIMAURL:      'IMAUsers/',
  visitaDiariaURL: 'VisitaDiaria/',
  IMA_ProdTiendaURL:'IMA_ProdTienda/',
  tokenMaps: 'pk.eyJ1IjoibWhlcnJhIiwiYSI6ImNrcWxhdXk4eTByMDUyd28xNnZ2b2hoMjMifQ.IrIAxPGO4oFiRVR8U5sqkA',
    
  // Encuestas
  getEncuetaClientesVista:'get/encuentas/clientes/vista',
  getEncuetasClienteVista:'get/encuentas/cliente/vista?id=',
  getEncuestasClientesVista:'get/encuentas/clientes/vista?id=',
  getEncuestas:'get/encuentas',
  postEncuesta:'post/encuesta',
  putEncuesta:'put/encuesta?id=',
  deleteEncuesta:'delete/encuesta?id=',

  // Encuestas Clientes

  getEncuestasClientes:'get/encuentas/clientes',
  getEncuestasCliente:'get/encuentas/cliente?id=',
  postEncuestaCliente:'post/encuesta/cliente',
  putEncuestaCliente:'put/encuesta/cliente?id=',
  deleteEncuestaCliente:'delete/encuesta/cliente?id=',

// Encuestas Lineas
getEncuestasLineas:'get/lista/preguntas',
getEncuestaLineas:'get/encuenta/lineas?id=',
getEncuestaLinea:'get/encuenta/linea?id=',
postEncuestaLinea:'post/encuesta/linea',
putEncuestaLinea:'put/encuesta/linea?id=',
deleteEncuestaLinea:'delete/encuesta/linea?id=',
  
  // respuestas
  getRespuestasEncuestaLinea:'get/respuestas/encuenta/linea?id=',
  postRespuestaEncuestaLinea:'post/respuesta/encuesta/linea',
  deleteRespuestaEncuestaLinea:'delete/respuesta/encuesta/linea?id=',

  // clientes
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
