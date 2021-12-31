import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'wallet',
        children: [
          {
            path: '',
            loadChildren: '../wallet/wallet.module#WalletPageModule'
          }
        ]
      },
      {
        path: 'advertise',
        children: [
          {
            path: '',
            loadChildren: '../advertise/advertise.module#AdvertisePageModule'
          }
        ]
      },
      {
        path: 'mainpage',
        children: [
          {
            path: '',
            loadChildren: '../mainpage/mainpage.module#MainpagePageModule'
          }
        ]
      },
      {
        path: 'notification',
        children: [
          {
            path: '',
            loadChildren: '../notification/notification.module#NotificationPageModule'
          }
        ]
      },
      {
        path: 'setting',
        children: [
          {
            path: '',
            loadChildren: '../setting/setting.module#SettingPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/advertise',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/advertise',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
