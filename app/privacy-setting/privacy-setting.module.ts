import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PrivacySettingPage } from './privacy-setting.page';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';

const routes: Routes = [
  {
    path: '',
    component: PrivacySettingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PrivacySettingPage],
  providers: [BackgroundGeolocation]
})
export class PrivacySettingPageModule { }
