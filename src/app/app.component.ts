import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { LoginPage } from '../pages/login/login';
import { LogueoService } from "../services/logueo.service";
import { MenuPage } from '../pages/tabPrincipal/menu/menu';
// import { InicioPage } from '../pages/inicio/inicio';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public logueoSer:LogueoService,
    // private push: Push
  ) {
    platform.ready().then(() => {
      statusBar.backgroundColorByHexString('#1A652B');
      statusBar.isVisible;
    //   logueoSer.Session.subscribe((sesion)=>{
    //     if (sesion) {
    //       if (logueoSer.uid.uid === 'gAiVRPn475QifdP7CgHOni8ezMs1') {
    //         setTimeout(() => {
    //           this.rootPage=MenuPage;
    //         }, 2000);
    //       }else{
    //         this.rootPage=LoginPage;
    //         // logueoSer.cerrarSesion();
    //       }
    //     } else {
    //       this.rootPage = LoginPage;
    //     }
    //   })
    //   setTimeout(() => {
    //     splashScreen.hide();
    //   }, 100);
    });
    logueoSer.Session.subscribe(user =>{
      if (user) {
        this.rootPage = MenuPage
      }else {
        this.rootPage = LoginPage;
      }
    });
  }
}
