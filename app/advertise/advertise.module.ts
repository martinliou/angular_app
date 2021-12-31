import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdvertisePage } from './advertise.page';
import { AdvPopoverComponent } from '../adv-popover/adv-popover.component';

const routes: Routes = [
  {
    path: '',
    component: AdvertisePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot({
      mode: 'ios'
    }),
    RouterModule.forChild(routes)
  ],
  declarations: [AdvertisePage, AdvPopoverComponent],
  providers: [AdvPopoverComponent],
  entryComponents: [AdvPopoverComponent]
})
export class AdvertisePageModule { }
