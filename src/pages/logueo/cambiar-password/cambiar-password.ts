import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ToastController} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the CambiarPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cambiar-password',
  templateUrl: 'cambiar-password.html',
})
export class CambiarPasswordPage {
  correo:null;

  constructor(public navCtrl: NavController, public navParams: NavParams,public aouth:AngularFireAuth, public toast:ToastController) {
  }
  cerrar(){
    this.navCtrl.pop();
  }

  public verificar(){
    this.aouth.auth.sendPasswordResetEmail(this.correo)
    .then(()=>{
      this.toast.create({
        message:'Se ha enviado un correo a su correo electronico. siga los pasos Correspondiente',
        duration: 3000,
        cssClass:'toast-success'
      }).present();
    }).catch(()=>{
      this.toast.create({
        message:'Correo invalido',
        duration: 3000,
        position:'botton',
        cssClass:'toast-error'
      }).present();
    })
  }

}
