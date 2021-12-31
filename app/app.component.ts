import { Component } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { initializeApp } from 'firebase';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { CommonService } from './common.service';
import { NavigationExtras } from '@angular/router';

initializeApp(environment.firebase);

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private firebase: Firebase,
        private alertCtrl: AlertController,
        private api: ApiService,
        private common: CommonService,
        private router: Router
    ) {
        this.loadData();
    }

    async loadData() {
        let getData = {
            access_token: localStorage.getItem('access_token')
        };

        this.initialize();
        this.api.preCheck(getData)
            .subscribe(async (resp: any) => {

                if (resp.status == 0) {

                    let result = resp.result;
                    let navigationExtras: NavigationExtras = {
                        state: {
                            advertises: result.advertises,
                            hasMission: result.has_mission,
                            tags: result.tags
                        }
                    }

                    if (this.platform.is('android') && result.android_ver != environment.android_ver) {
                        const alert = await this.alertCtrl.create({
                            header: '更新通知',
                            message: '偵測到舊版程式，請至Google Play下載新版本！',
                            backdropDismiss: false,
                            buttons: [{
                                text: '立即前往',
                                handler: () => {
                                    window.open('market://details?id=your.package.name', '_system');
                                    return false;
                                }
                            }]
                        });

                        await alert.present();
                    } else if (this.platform.is('ios') && result.ios_ver != environment.ios_ver) {
                        const alert = await this.alertCtrl.create({
                            header: '更新通知',
                            message: '偵測到舊版程式，請至App Store下載新版本！',
                            backdropDismiss: false,
                            buttons: [{
                                text: '立即前往',
                                handler: () => {
                                    return false;
                                }
                            }]
                        });

                        await alert.present();
                    }

                    if (this.router.url == '/') {
                        this.router.navigate(['/tabs/advertise'], navigationExtras);
                    }
                } else {
                    if(!localStorage.getItem('first_init')) {
                        this.router.navigate(['/intro']);
                        return;
                    }
                }
            });
    }

    initialize() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
     
            this.firebase.grantPermission();
            this.firebase.onNotificationOpen().subscribe(async data => {
                console.log(data);
                if (data.tap) {
                    this.router.navigate(['/tabs/notification']);
                } else {
                    if (data.notify_type == 'user_system_announce') {
                        const alert = await this.alertCtrl.create({
                            header: '新通知',
                            mode: 'ios',
                            message: '有新的系統訊息！',
                            backdropDismiss: false,
                            buttons: [{
                                text: '前往',
                                cssClass: 'danger-color',
                                handler: async () => {
                                    this.router.navigate(['/tabs/notification']);
                                }
                            }, {
                                text: '好的',
                            }]
                        });

                        alert.present();
                    } else if (data.notify_type == 'personal_message') {
                        const alert = await this.alertCtrl.create({
                            header: data.title,
                            mode: 'ios',
                            message: data.content,
                            backdropDismiss: false,
                            buttons: [{
                                text: '前往',
                                cssClass: 'danger-color',
                                handler: async () => {
                                    this.router.navigate(['/tabs/notification']);
                                }
                            }, {
                                text: '好的',
                            }]
                        });

                        alert.present();
                    } else if (data.notify_type == 'withdraw_wallet_update') {
                        const alert = await this.alertCtrl.create({
                            header: data.title,
                            mode: 'ios',
                            message: data.body,
                            backdropDismiss: false,
                            buttons: [{
                                text: '前往',
                                cssClass: 'danger-color',
                                handler: async () => {
                                    this.router.navigate(['/tabs/notification']);
                                }
                            }, {
                                text: '好的',
                            }]
                        });

                        alert.present();
                    }
                }
            });

        });
    }

}
