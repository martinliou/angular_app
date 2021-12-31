import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdvertiseConfirmPage } from './advertise-confirm.page';

const routes: Routes = [
  {
    path: '',
    component: AdvertiseConfirmPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdvertiseConfirmPage]
})
export class AdvertiseConfirmPageModule {}
