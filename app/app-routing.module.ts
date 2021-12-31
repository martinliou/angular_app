import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'wallet', loadChildren: './wallet/wallet.module#WalletPageModule' },
  { path: 'advertise', loadChildren: './advertise/advertise.module#AdvertisePageModule' },
  { path: 'mainpage', loadChildren: './mainpage/mainpage.module#MainpagePageModule' },
  { path: 'notification', loadChildren: './notification/notification.module#NotificationPageModule' },
  { path: 'setting', loadChildren: './setting/setting.module#SettingPageModule' },
  { path: 'withdraw', loadChildren: './withdraw/withdraw.module#WithdrawPageModule' },
  { path: 'bank-account', loadChildren: './bank-account/bank-account.module#BankAccountPageModule' },
  { path: 'bank-account-add', loadChildren: './bank-account-add/bank-account-add.module#BankAccountAddPageModule' },
  { path: 'bank-account-add-next', loadChildren: './bank-account-add-next/bank-account-add-next.module#BankAccountAddNextPageModule' },
  { path: 'transaction', loadChildren: './transaction/transaction.module#TransactionPageModule' },
  { path: 'transaction-detail', loadChildren: './transaction-detail/transaction-detail.module#TransactionDetailPageModule' },
  { path: 'notification-detail', loadChildren: './notification-detail/notification-detail.module#NotificationDetailPageModule' },
  { path: 'person-edit', loadChildren: './person-edit/person-edit.module#PersonEditPageModule' },
  { path: 'privacy-setting', loadChildren: './privacy-setting/privacy-setting.module#PrivacySettingPageModule' },
  { path: 'safety', loadChildren: './safety/safety.module#SafetyPageModule' },
  { path: 'phone-change', loadChildren: './phone-change/phone-change.module#PhoneChangePageModule' },
  { path: 'ble-setting', loadChildren: './ble-setting/ble-setting.module#BleSettingPageModule' },
  { path: 'advertise-detail', loadChildren: './advertise-detail/advertise-detail.module#AdvertiseDetailPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'user-pref', loadChildren: './user-pref/user-pref.module#UserPrefPageModule' },
  { path: 'drive-setting', loadChildren: './drive-setting/drive-setting.module#DriveSettingPageModule' },
  { path: 'history-order', loadChildren: './history-order/history-order.module#HistoryOrderPageModule' },
  { path: 'history-order-detail', loadChildren: './history-order-detail/history-order-detail.module#HistoryOrderDetailPageModule' },
  { path: 'bank-account-detail', loadChildren: './bank-account-detail/bank-account-detail.module#BankAccountDetailPageModule' },
  { path: 'advertise-confirm', loadChildren: './advertise-confirm/advertise-confirm.module#AdvertiseConfirmPageModule' },
  { path: 'mission', loadChildren: './mission/mission.module#MissionPageModule' },
  { path: 'mission-detail', loadChildren: './mission-detail/mission-detail.module#MissionDetailPageModule' },
  { path: 'mission-upload', loadChildren: './mission-upload/mission-upload.module#MissionUploadPageModule' },
  { path: 'document', loadChildren: './document/document.module#DocumentPageModule' },
  { path: 'privacy', loadChildren: './privacy/privacy.module#PrivacyPageModule' },
  { path: 'intro', loadChildren: './intro/intro.module#IntroPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
