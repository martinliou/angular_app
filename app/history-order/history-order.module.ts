import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { PipesModule } from '../pipes/pipe.module';
import { IonicModule } from '@ionic/angular';
import { HistoryOrderPage } from './history-order.page';
import { Geolocation } from "@ionic-native/geolocation/ngx";

const routes: Routes = [
  {
    path: '',
    component: HistoryOrderPage
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
  declarations: [HistoryOrderPage],
  providers: [Geolocation]
})
export class HistoryOrderPageModule { }
