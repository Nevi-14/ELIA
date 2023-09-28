import { Pipe, PipeTransform } from '@angular/core';
import { Justificacion, justificaciones } from '../models/constantes';

@Pipe({
  name: 'justifica'
})
export class JustificaPipe implements PipeTransform {

  transform(id: string): string {
    let arreglo: Justificacion[];

    arreglo = justificaciones.slice(0);
    const i = arreglo.findIndex( d => d.id === id );
    if (i >= 0){
      return arreglo[i].valor;
    } else {
      return id;
    }
  }

}
