import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { PersonEditPage } from './person-edit.page';

const routes: Routes = [
  {
    path: '',
    component: PersonEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PersonEditPage],
  providers: [Camera]
})
export class PersonEditPageModule { }
