import { Component, OnInit, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartData, ChartEvent, ChartType, ChartConfiguration } from 'chart.js';
import { BaseChartDirective, ThemeService } from 'ng2-charts'; // https://www.npmjs.com/package/ng2-charts + https://valor-software.com/ng2-charts/#PieChart  + https://www.npmjs.com/package/chartjs-plugin-datalabels
import { Platform } from '@ionic/angular';

import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service';
// npm i ng2-charts --save -dev
// npm i chart.js --save -dev
// npm i chartjs-plugin-datalabels --save -dev
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  width: number = 0;
  chartHeight = '0px';


  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    }
  };
  pieChartData: ChartData<'pie', number[], string | string[] >= {
    labels: [],
    datasets: [{
      data: []
    }]
  }
  
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [DatalabelsPlugin];

  constructor(
    public plt: Platform,
    public alertasService: AlertasService,
    public cd: ChangeDetectorRef,
    public router: Router,


  ) { }

  ngOnInit() {

    let labels =  ['Web Sales', 'Store Sales', 'Mail Sales'];
    let data = [300, 500, 100];
    this.pieChartData = {
      labels: labels,
      datasets: [{
        data: data
      }]
    }
this.toggleMenu();
  }
  ionViewWillEnter() {
 
    this.alertasService.presentaLoading('Cargando datos...')
    this.width = this.plt.width();
    this.toggleMenu()
    let labels = ['Web Sales', 'Store Sales', 'Mail Sales'];
    let data = [300, 500, 100];


    setTimeout(() => {

      this.pieChartData = {
        labels: labels,
        datasets: [{
          data: data
        }]
      }
      this.alertasService.loadingDissmiss();

    }, 1000)

  }

  toggleMenu() {

    if (this.width > 1400) {

      this.chartHeight = '600px';

    } else if (this.width >= 768 && this.width <= 1366) {

      this.chartHeight = '400px';

    } else {


      this.chartHeight = '100%';


    }


    this.cd.detectChanges();
    this.cd.markForCheck();


  }



  // CHECKS SCREEN RESIZE LIVE

  @HostListener('window:resize', ['$event'])

  private onResize(event:any) {

    this.width = event.target.innerWidth;
    this.toggleMenu();

  }


}
