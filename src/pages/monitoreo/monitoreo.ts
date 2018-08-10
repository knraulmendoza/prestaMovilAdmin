import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// import { MapComponent } from '../../components/map/map'

/**
 * Generated class for the MonitoreoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-monitoreo',
  templateUrl: 'monitoreo.html',
  // entryComponents: [MapComponent]
})
export class MonitoreoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MonitoreoPage');
  }

}
