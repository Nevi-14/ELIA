import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniMapaComponent } from './mini-mapa/mini-mapa.component';
import { MapaComponent } from './mapa/mapa.component';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../pipes/pipes.module';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { PiePaginaComponent } from './pie-pagina/pie-pagina.component';
import { RobotMessageComponent } from './robot-message/robot-message.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { NgChartsModule } from 'ng2-charts';




@NgModule({
  declarations: [MiniMapaComponent,MapaComponent,EncabezadoComponent,PiePaginaComponent, RobotMessageComponent, PieChartComponent],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
    NgChartsModule
  ],
  exports: [
  MiniMapaComponent,MapaComponent,EncabezadoComponent,PiePaginaComponent,RobotMessageComponent,PieChartComponent

  ]
})
export class ComponentsModule { }
