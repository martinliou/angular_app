import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BankAccountAddPage } from './bank-account-add.page';

const routes: Routes = [
  {
    path: '',
    component: BankAccountAddPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BankAccountAddPage]
})
export class BankAccountAddPageModule {}
