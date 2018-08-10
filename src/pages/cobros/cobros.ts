import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms'
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { Validar } from "../../validaciones/validar";
import { LogueoService } from '../../services/logueo.service';
import { iCobro } from '../../interfaces/interfaces';
import { BdService } from '../../services/bd.service';
// import { iCobro } from '../../../models/interfaces';


/**
 * Generated class for the NewCobroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-cobros',
  templateUrl: 'cobros.html',
})
export class CobrosPage {
  public formCobros : FormGroup;
  passRepit=null;
  dinero: number;
  cobro:iCobro;
  cobros:iCobro[];
  menu:string='add';
  // cobro;
  // cobro={key: Math.random(),name:String,fecha:Date.prototype,dineroInicial:Number.prototype,dineroFinal:Number.prototype,user:String,pass:String};
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtr: ViewController,
    public toast: ToastController,
    public loginSer: LogueoService,
    public db:BdService,
    public formBuild: FormBuilder) {
      this.formCobros = formBuild.group({
        name: ['', Validators.compose([Validators.required])],
        fecha: ['', Validators.compose([Validators.required])],
        dineroInicial: ['', Validators.compose([Validators.required, Validar.dinerValido])],
        // dineroFinal: [this.formCobros.value.dineroInicial, Validators.compose([Validators.required, Validar.dinerValido])],
        // user: ['',Validators.compose([Validators.required,Validators.email])],
        pass: ['',Validators.compose([Validators.required])],
        repitPass: ['', Validators.compose([Validators.required])]
      });
      this.listaCobros();
    }
  
    public listaCobros(){
      this.db.consultaId('cobro').subscribe(listCobro=>{
        let cobros:iCobro[]=[];
        listCobro.forEach((cobro:iCobro) => {
          cobros.push(cobro);
        });
        this.cobros = cobros;
      })
    }
  public cerrar(){
    this.viewCtr.dismiss();
  }

  cobroJson(form:FormGroup){
    return {
      name:form.get('name').value,
      fecha:form.get('fecha').value,
      dinerInicial:parseFloat(form.get('dineroInicial').value)*1000,
      dinerFinal:parseFloat(form.get('dineroInicial').value)*1000,
      pass:form.get('pass').value,
      state:true
    } as iCobro
  }

  toastMensaje(mensaje:string,duration:number,css:string){
    this.toast.create({
      message: mensaje,
      duration: duration,
      cssClass:css
    }).present();
  }

  public addCobro() {
    this.cobro = this.cobroJson(this.formCobros);
      if (this.cobro.pass != this.formCobros.get('repitPass').value) {
        this.toastMensaje('las contraseñas no son iguales',2000,'toast-error');
      }else{
        console.log(this.cobro)
        let user = `${this.cobro.name}@gmail.com`;
        this.loginSer.createUser(user,this.cobro.pass)
        .then((res)=>{
          console.log('usuario creado'+res.user.uid);
          this.db.add('cobro',this.cobro,2,res.user.uid)
          // this.cobroSer.newCobro(this.cobro)
          .then(()=>{
            this.toastMensaje('se ha registrado con exito',2000,'toast-success');
            this.formCobros.reset();
            this.menu = 'show';
          }).catch(()=>{
            this.toastMensaje('No se pudo registrar el cobro',3000,'toast-error');
          })
        }).catch(()=>{
          this.toastMensaje('No se pudo crear el usuario',2000,'toast-error')
        })
      }
    }
  
}
