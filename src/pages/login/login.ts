import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Network } from "@ionic-native/network";
import { Toast, } from "@ionic-native/toast";
import { IonicPage, NavController, NavParams, Nav , LoadingController, ToastController} from 'ionic-angular';
import { FirebaseMessaging } from '@ionic-native/firebase-messaging';
import { LogueoService } from '../../services/logueo.service';
import { GlobalService } from '../../services/globales.service';
import { BdService } from '../../services/bd.service';
import { Device } from '@ionic-native/device';
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
    public device:Device,
    public logueoSer:LogueoService) {
      this.rootNavCtrl = navParams.get('rootNavCtrl');
      this.formLogin = build.group({
        user:['',Validators.compose([Validators.required])],
        password:['',Validators.compose([Validators.required,Validators.minLength(6)])]
      });
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

  buscarUser(user){
    let bandera=false;
    user.forEach(element => {
      if (element.user === 'administrador') {
        bandera = true;
      }
    });
    return bandera;
  }
  getToken() {
    this.firebaseMsg.getToken().then((_token) => {
      let token = {
        users: [{rol:1,user:'administrador',token: _token,fecha : `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`}],
        modelo: this.device.model,
        device: this.device.manufacturer,
      }
      let tablaDevice = this.db.getDatos('devices',this.device.uuid,1);
      tablaDevice.ref.get().then(ok => {
        if (ok.exists) {
          tablaDevice.valueChanges().subscribe(res => {
              console.log('existe');
              token = res;
              if (!this.buscarUser(res.users)) {
                token.users.push({rol:1,user:'admistrador',token: _token,fecha : `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`});
              }
              this.db.add('devices',token,2,this.device.uuid).then(() => {
                console.log('funciono')
              }).catch((err) => console.log(err));
          });
        }else{
          console.log('la tabla no existe');
          this.db.add('devices',token,2,this.device.uuid).then(() => {
            console.log('funciono')
          }).catch((err) => console.log(err));
        }
      });
    })
    
  }
  public logueo(){
    let user = `${this.formLogin.get('user').value}@gmail.com`
    let pass = this.formLogin.get('password').value;
      this.logueoSer.loginUser(user.toLowerCase(),pass)
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
              // this.navCtrl.setRoot(MenuPage);
              cargar.dismiss();
            }, 5000);
          });
        }else{
          this.mensajeToast('Este usuario no puede ingresar en esta app',2);
          this.logueoSer.cerrarSesion();
        }
      })
      .catch(()=>{
        this.mensajeToast('correo y/o contraseña invalida',3);
      })
  }
  mensajeToast(msg:string,key:number){
    // let background_color:string='';
    // let text_color:string='';
    // switch (key) {
    //   case 1:
    //     background_color='#02E81D';
    //     text_color='#fff';
    //     break;
    //   case 2:
    //     background_color='#FF1429'
    //     text_color='#fff';
    //     break;
    //   case 3:
    //     background_color='#fff';
    //     text_color='#02E81D';
    //     break;
    //   default:
    //     break;
    // }
    // let opciones: ToastOptions = {
    //   message: msg,
    //   position:'bottom',
    //   styling: {
    //     backgroundColor:'#fff',
    //     textColor:'#02E81D',
    //   }
    // }
    // this.toastNative.showWithOptions({
    //   message: msg,
    //   duration:3000,
    //   position:'bottom',
    //   styling: {
    //     backgroundColor:'#fff',
    //     textColor:'#02E81D',
    //   }
    // }).subscribe((toast)=>{console.log(toast)});
    this.toastNative.show(msg,'3000','bottom').subscribe((toast)=>{console.log(toast)})
  }
  public cambiarPassword(){
    if (this.formLogin.get('user').valid) {
      let user = `${this.formLogin.get('user').value}@gmail.com`
      this.logueoSer.updatePass(user)
      .then(() => {this.mensajeToast(`Verifique su correo electronico ${user}`,1)})
      .catch(() => {this.mensajeToast('Este usuario no existe',2)});
    }else {
      this.mensajeToast('Ingrese el usuario',3);
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
