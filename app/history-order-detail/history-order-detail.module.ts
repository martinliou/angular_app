import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HistoryOrderDetailPage } from './history-order-detail.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryOrderDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HistoryOrderDetailPage]
})
export class HistoryOrderDetailPageModule {}
