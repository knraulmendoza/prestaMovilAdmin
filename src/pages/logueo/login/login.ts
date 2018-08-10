import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Network } from "@ionic-native/network";
import { Toast } from "@ionic-native/toast";
import { IonicPage, NavController, NavParams, Nav , LoadingController, ToastController} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseMessaging } from '@ionic-native/firebase-messaging';

import { MenuPage } from '../../tabPrincipal/menu/menu';
import { CambiarPasswordPage } from '../cambiar-password/cambiar-password';
import { LogueoService } from '../../../services/logueo.service';
import { iCobro, iPagos } from '../../../interfaces/interfaces';
import { GlobalService } from '../../../services/globales.service';
import { BdService } from '../../../services/bd.service';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  // rootNavCtrl: NavController;
  conexion:boolean=true;
  @ViewChild('myNav') nav: Nav;
  rootNavCtrl: NavController;
  // user = {} as User;
  focu: boolean = false;
  public formLogin:FormGroup;
  // user: string;
  // pass: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: LoadingController,
    private aouth: AngularFireAuth,
    public toast: ToastController,
    public build: FormBuilder,
    private network:Network,
    private toastNative:Toast,
    public globalSer:GlobalService,
    public db:BdService,
    public firebaseMsg: FirebaseMessaging,
    public logueoSer:LogueoService) {
      this.rootNavCtrl = navParams.get('rootNavCtrl');
      this.formLogin = build.group({
        user:['',Validators.compose([Validators.required])],
        password:['',Validators.compose([Validators.required])]
      });
    // this.rootNavCtrl = navParams.get('rootNavCtrl');
    
  }
  ionViewDidEnter(){
    // console.log(this.logueoSer.uid.uid);
    
    this.network.onConnect().subscribe(data=>{
      this.conexion=true;
      this.toast.create({
        message:'conectado',
        duration:3000,
        cssClass:'toast-success'
      }).present();
    },error=>console.error('error'));
    this.network.onDisconnect().subscribe(data=>{
      this.conexion=false;
      this.toast.create({
        message:'Conectese a internet',
        duration:8000,
        cssClass:'toast-error'
      }).present();
    },error=>console.error('error'));
  }
  getToken() {
    this.firebaseMsg.getToken().then((_token) => {
      let token = {
        token: _token
      }
      console.log(`token: ${_token} y jsonToken: ${token.token}`);
      this.db.add('devices',token,2,_token).then(() => {
        console.log('funciono')
      }).catch((err) => console.log(err));
    })
    
  }
  public logueo(){
    let user = `${this.formLogin.get('user').value}@gmail.com`
    let pass = this.formLogin.get('password').value;
      this.logueoSer.loginUser(user,pass)
      .then(()=>{
        let id = this.logueoSer.uid.uid;
        if (id=='gAiVRPn475QifdP7CgHOni8ezMs1') {
          this.getToken();
          let cargar = this.loading.create({
            content: "Cargando Espere...",
            duration: 4000
          });
          cargar.present().then(()=>{
            setTimeout(() => {
              this.navCtrl.setRoot(MenuPage);
              cargar.dismiss();
            }, 5000);
          });
        }else{
          this.toast.create({
            message: "Este usuario no puede ingresar en esta app",
            duration: 3000
          }).present();
          this.logueoSer.cerrarSesion();
        }
      })
      .catch(()=>{
        this.toastNative.show('correo y/o contraseña invalida','3000','bottom').subscribe((toast)=>{
          console.log(toast);
        });
      })
  }
  public cambiarPassword(){
    // if(localNavCtrl){
    //   this.nav.push(CambiarPasswordPage);
    // }else{
    //   this.rootNavCtrl.push(CambiarPasswordPage);
    // }
    this.navCtrl.push(CambiarPasswordPage);
  }

  /**
   * focus
   */
  public enfoque() {
    this.focu = true;
  }
  /**
   *  desenfoque
   */
  public  desenfoque() {
    this.focu = false;
  }

  // public loginGoogle(){
  //   this.logueoSer.loginUser()
  //   .then(()=>{
  //       let cargar = this.loading.create({
  //         content: "Cargando Espere...",
  //         duration: 3000
  //       });
  //       cargar.present().then(()=>{
  //         setTimeout(() => {
  //           cargar.dismiss();
  //         }, 5000);
  //       });
  //       setTimeout(() => {
  //         this.navCtrl.setRoot(MenuPage);
  //       }, 2000);
  //   });
  // }
}
