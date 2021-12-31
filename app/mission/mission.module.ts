import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { PipesModule } from '../pipes/pipe.module';

import { IonicModule } from '@ionic/angular';

import { MissionPage } from './mission.page';

const routes: Routes = [
  {
    path: '',
    component: MissionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MissionPage]
})
export class MissionPageModule { }
