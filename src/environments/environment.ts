// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  maxCharCodigoProd: 6,
  adminClave: '@dmin2021*',
  preURL: 'http://api_isa',
  TestURL: '_test',
  postURL: '.di-apps.co.cr/api/',
  IMAURL: 'http://mercaderistas.di-apps.co.cr/api/',
  ArticulosURL: 'IMArticulos/',
  rutasURL: 'IMA_Rutas/',
  clientesISAURL: 'IMA_Clientes/',
  clientesIMAURL: 'Clientes/',
  rolVisitaURL: 'IMA_Visitas/',
  visitaDiaria: 'VisitaDiaria/',
  productosURL: 'IMA_ProdTienda/',
  ruteroPostURL: 'Rutero/',
  detalleRutURL: 'RuteroDet/',
  faltante: "../../../assets/icon/faltante.png",
  bajoStock: "../../../assets/icon/bajo.png",
  okStock: "../../../assets/icon/ok.png",
  
  // Encuestas
  getEncuetasClienteVista:'get/encuentas/cliente/vista?id=',
  
  // respuestas
  getRespuestasEncuestaLinea:'get/respuestas/encuenta/linea?id=',
  postRespuestaEncuestaLinea:'post/respuesta/encuesta/linea',
  deleteRespuestaEncuestaLinea:'delete/respuesta/encuesta/linea?id=',

  version: "1.2.0",
  prdMode: true,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
