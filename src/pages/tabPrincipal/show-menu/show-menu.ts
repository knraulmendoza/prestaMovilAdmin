import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { iCobro } from '../../../interfaces/interfaces';
import { BdService } from '../../../services/bd.service';
import { Toast } from '@ionic-native/toast';

/**
 * Generated class for the ShowMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-show-menu',
  templateUrl: 'show-menu.html',
})
export class ShowMenuPage {
  chartOptions: any;
  cobros:iCobro[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public db: BdService,public toast: Toast) {
    this.chartOptions = {
      chart: {
        type: 'bar'
      },
      title: {
          text: 'Estadistica Ultimos 3 meses',
          style:{
            color: "primary"
          }
      },
    // subtitle: {
    //     text: 'Source: <a href="https://en.wikipedia.org/wiki/World_population">Wikipedia.org</a>'
    // },
      xAxis: {
          categories: ['Cobro 1', 'Cobro 2', 'Cobro 3', 'Cobro 4'],
          title: {
              text: null
          }
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Cantidad de dinero',
              align: 'high'
          },
          labels: {
              overflow: 'justify'
          }
      },
      tooltip: {
          valueSuffix: ' millones'
      },
      plotOptions: {
          bar: {
              dataLabels: {
                  enabled: true
              }
          }
      },
      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -40,
          y: 80,
          floating: true,
          borderWidth: 1,
          // backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
          shadow: true
      },
      credits: {
          enabled: false
      },
      series: [{
          name: 'Noviembre',
          data: [10, 31, 63, 20]
      }, {
          name: 'Diciembre',
          data: [13, 15, 44, 40]
      }, {
          name: 'Enero',
          data: [10, 25, 42, 74]
      }]
    }
    this.listaCobros();
  }

  public listaCobros(){
      this.db.consultaId('cobro').subscribe((res)=>{
          let cobrs=[];
          res.forEach((respuesta:iCobro) => {
              cobrs.push(respuesta);
          });
          this.cobros = cobrs;
      })
  }
  public mensajeToast(msg:string){
      this.toast.showShortBottom(msg).subscribe(toasts=>{console.log(toasts)})
  }
  public cambiarState(e,cobro:iCobro){
    this.db.updateCobro(e.checked,cobro.id)
    .then(()=>{
        if (e.checked) {
            this.mensajeToast(`El cobro ${cobro.name} esta activo`);
        } else this.mensajeToast(`El cobro ${cobro.name} esta inactivo`);
    })
    .catch((error)=>{
        this.mensajeToast('Error verifique su conectividad');
    })
  }
}
