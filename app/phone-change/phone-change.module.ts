import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { Firebase } from '@ionic-native/firebase/ngx';

import { PhoneChangePage } from './phone-change.page';

const routes: Routes = [
  {
    path: '',
    component: PhoneChangePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PhoneChangePage],
  providers: [Firebase]
})
export class PhoneChangePageModule { }
