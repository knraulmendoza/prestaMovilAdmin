import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Network } from "@ionic-native/network";
import { Toast } from "@ionic-native/toast";
import { IonicPage, NavController, NavParams, Nav , LoadingController, ToastController} from 'ionic-angular';
import { FirebaseMessaging } from '@ionic-native/firebase-messaging';

import { MenuPage } from '../../tabPrincipal/menu/menu';
import { LogueoService } from '../../../services/logueo.service';
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
          this.mensajeToast('Este usuario no puede ingresar en esta app');
          this.logueoSer.cerrarSesion();
        }
      })
      .catch(()=>{
        this.mensajeToast('correo y/o contraseña invalida');
      })
  }
  mensajeToast(msg:string){
    this.toastNative.showShortBottom(msg);
  }
  public cambiarPassword(){
    if (this.formLogin.get('user').valid) {
      let user = `${this.formLogin.get('user').value}@gmail.com`
      this.logueoSer.updatePass(user)
      .then(() => {this.mensajeToast(`Verifique su correo electronico ${user}`)})
      .catch(() => {this.mensajeToast('Este usuario no existe')});
    }else {
      this.mensajeToast('Ingrese el usuario');
    }
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

}
