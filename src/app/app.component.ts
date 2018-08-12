import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { LogueoService } from "../services/logueo.service";
import { MenuPage } from '../pages/tabPrincipal/menu/menu';


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
  ) {
    platform.ready().then(() => {
      statusBar.backgroundColorByHexString('#1A652B');
      statusBar.isVisible;
      splashScreen.hide();
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
