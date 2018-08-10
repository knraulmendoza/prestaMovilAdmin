import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { LoginPage } from '../pages/logueo/login/login';
import { MenuPage } from '../pages/tabPrincipal/menu/menu';
import { LogueoService } from "../services/logueo.service";
// import { InicioPage } from '../pages/inicio/inicio';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any=LoginPage;
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public logueoSer:LogueoService,
    // private push: Push
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault();
      statusBar.backgroundColorByHexString('#1A652B');
      statusBar.isVisible;
      splashScreen.hide();
    });
    
    // platform.ready()
    // .then(()=>{
    //   logueoSer.Session.subscribe((session)=>{
    //     if (session) {
    //       let id = logueoSer.uid.uid;
    //       console.log(id);
    //       if (id=='gAiVRPn475QifdP7CgHOni8ezMs1') {
    //         setTimeout(() => {
    //           this.rootPage=MenuPage;
    //         }, 2000);
    //       }else{
    //         this.rootPage= LoginPage;
    //         this.logueoSer.cerrarSesion();
    //       }
    //     }else{
    //       this.rootPage= LoginPage;
    //     }
    //   })
    //   setTimeout(()=>{
    //     splashScreen.hide();
    //   },100);
    // });
  }
}
