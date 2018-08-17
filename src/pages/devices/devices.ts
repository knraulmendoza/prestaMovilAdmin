import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BdService } from '../../services/bd.service';

/**
 * Generated class for the DevicesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-devices',
  templateUrl: 'devices.html',
})
export class DevicesPage {

  devices=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public db: BdService) {
    this.listaDevices();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DevicesPage');
  }

  public listaDevices(){
    this.db.consultaId('devices').subscribe((res)=>{
      let device=[];
      res.forEach(devic => {
        device.push(devic);
      });
      this.devices = device;
    });
  }

  public abrirDevice(i:number){
    this.devices[i].open = !this.devices[i].open;
  }
}
