import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MonitoreoPage } from './monitoreo';

@NgModule({
  declarations: [
    MonitoreoPage,
  ],
  imports: [
    IonicPageModule.forChild(MonitoreoPage),
  ],
})
export class MonitoreoPageModule {}
