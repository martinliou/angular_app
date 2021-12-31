import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserPrefPage } from './user-pref.page';
import { EulaPopoverComponent } from '../eula-popover/eula-popover.component';
const routes: Routes = [
  {
    path: '',
    component: UserPrefPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserPrefPage, EulaPopoverComponent],
  providers: [EulaPopoverComponent],
  entryComponents: [EulaPopoverComponent]
})
export class UserPrefPageModule { }
