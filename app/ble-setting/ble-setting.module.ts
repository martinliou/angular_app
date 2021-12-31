import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';
import { BleSettingPage } from './ble-setting.page';

const routes: Routes = [
  {
    path: '',
    component: BleSettingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BleSettingPage],
  providers: [BLE]
})
export class BleSettingPageModule { }
