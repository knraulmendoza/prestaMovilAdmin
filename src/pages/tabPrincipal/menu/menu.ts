import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Nav,LoadingController,ToastController } from 'ionic-angular';
import { iCobro, iCuadre, iGastos } from "../../../interfaces/interfaces";

import { TabsPage } from '../tabs/tabs';
import { CobrosPage } from '../../cobros/cobros';
import { ShowMenuPage } from '../show-menu/show-menu';
import { MonitoreoPage } from "../../monitoreo/monitoreo";
import { LogueoService } from '../../../services/logueo.service';
import { LoginPage } from '../../login/login';
import { GlobalService } from '../../../services/globales.service';
import { BdService } from '../../../services/bd.service';
import { ClientesPage } from '../../clientes/clientes';
// import { CloudMsgServices } from '../../../services/cloudMsg.service';
/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  @ViewChild('content') public nav: Nav;
  cobroSelect:string;
  selectCobro:boolean;
  cobros:iCobro[];
  getCobro:string='';
  rootPage:any=ShowMenuPage;
  listaBotones=[];
  fecha =  new Date()//`${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`
  listaPages=[
    {titulo:'Inicio', component: ShowMenuPage},
    {titulo:'Monitoreo', component: MonitoreoPage},
    {titulo:'Cobro', component:TabsPage},
    {titulo:'Clientes',component:ClientesPage}
  ]
  
  constructor(
    public logueoSer:LogueoService,
    public globalSer:GlobalService,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public db: BdService,
    public loading:LoadingController,
    // public cloudMsg: CloudMsgServices,
    public toast:ToastController,
    public modal: ModalController) {
    this.selectCobro = true;
    this.listaCobros();
  }

  ionViewDidLoad(){
    // this.cloudMsg.getToken();
    // this.cloudMsg.listenToNotifications().pipe(
    //   tap(msg=>{
    //     this.toast.create({
    //       message:msg.body,
    //       duration:3000
    //     }).present();
    //   })
    // ).subscribe();
  }

  public listaCobros(){
    
    this.db.consultaId('cobro').subscribe((res)=>{
      let cobro=[]
      res.forEach(cli => {
        cobro.push(cli);
      });
      this.cobros = cobro;
    })
  }

  public showPage(page){
    this.nav.setRoot(page);
  }

  public select(e){
    // this.globalSer.getCuadre=null;
    // console.log(this.globalSer.getCuadre)
    if(e=="new"){
      this.modal.create(CobrosPage).present();
    }else{
      let dateHoy = `${this.fecha.getDate()}/${this.fecha.getMonth()+1}/${this.fecha.getFullYear()}`
      this.db.getDatos('cobro',e,1).valueChanges().subscribe((res:iCobro)=>{
        this.globalSer.getCobro = res;
        this.globalSer.getCobro.id = e;
        this.getCobro=res.name;
        this.globalSer.getCuadre={cobro:'',abonados:0,baseInicial:0,fecha:'',gastos:[],prestados:0,id:''};
        this.db.selectWhere('cuadre','cobro',e,1).subscribe(res=>{
          this.fecha.setDate(this.fecha.getDate()-1);
          if (res.length > 0) {
            let gasto=0;
            let cuadre:iCuadre=res[res.length-1];
            if (cuadre.fecha == "") {
              res[res.length-2].gastos.forEach((gast: iGastos) => {
                gasto += gast.dinero;
              });
              this.globalSer.getCuadre = res[res.length-1];
              this.globalSer.getCuadre.baseInicial = res[res.length-2].baseInicial - res[res.length-2].prestados - gasto+res[res.length-2].abonados;
            }else{
              cuadre.gastos.forEach((gast: iGastos) => {
                gasto += gast.dinero;
              });
              this.globalSer.getCuadre = res[res.length-1];
            }
          }else{
            // if (this.globalSer.getCuadre.cobro == "") {
              this.globalSer.getCuadre.baseInicial = this.globalSer.getCobro.dinerInicial;
              this.globalSer.getCuadre.fecha = dateHoy;
            // }
          }
        });
        this.nav.setRoot(TabsPage);
      });
      this.selectCobro = false;
      
    }
  }
  public cerrarSesion(){
    this.logueoSer.cerrarSesion()
    .then(()=>{
      let cargando =this.loading.create({
        content:'Cerrando sesión',
        duration:4000,
      });
      cargando.present().then(()=>{
        setTimeout(() => {
          this.navCtrl.setRoot(LoginPage);
          cargando.dismiss();
        }, 3000);
      });
      
    });

  }
}
