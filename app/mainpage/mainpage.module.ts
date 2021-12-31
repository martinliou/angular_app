import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MainpagePage } from './mainpage.page';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { DatePipe } from '@angular/common';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { BLE } from '@ionic-native/ble/ngx';

const routes: Routes = [
  {
    path: '',
    component: MainpagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MainpagePage],
  providers: [Geolocation, DatePipe, BackgroundGeolocation, BluetoothSerial, BackgroundMode, BLE]
})
export class MainpagePageModule { }
