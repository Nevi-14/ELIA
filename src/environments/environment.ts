// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  prdMode: true,
  maxCharCodigoProd: 6,
  adminClave: '123456',
  preURL: 'http://api_isa',
  TestURL: '_test',
  postURL: '.soportecr.xyz/api/',
  IMAURL: 'http://mercaderistas.soportecr.xyz/api/',
  rutasURL: 'IMA_Rutas/',
  clientesURL: 'IMA_Clientes/',
  rolVisitaURL: 'IMA_Visitas/',
  productosURL: 'productos/',
  ruteroPostURL: 'Rutero/',
  detalleRutURL: 'RuteroDet/',
  faltante: "../../../assets/icon/faltante.png",
  bajoStock: "../../../assets/icon/bajo.png",
  okStock: "../../../assets/icon/ok.png",
  version: "1.0.0"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.