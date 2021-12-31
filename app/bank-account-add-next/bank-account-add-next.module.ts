import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BankAccountAddNextPage } from './bank-account-add-next.page';

const routes: Routes = [
  {
    path: '',
    component: BankAccountAddNextPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BankAccountAddNextPage]
})
export class BankAccountAddNextPageModule {}
