import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { ApiService } from '../api.service';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';

@Component({
    selector: 'app-privacy-setting',
    templateUrl: './privacy-setting.page.html',
    styleUrls: ['./privacy-setting.page.scss'],
})
export class PrivacySettingPage implements OnInit {

    notification: number;
    personMsg: number;
    systemAnno: number;
    walletUpdate: number;
    locationAuth: number;
    id: any;

    constructor(private common: CommonService,
        private backgroundGeolocation: BackgroundGeolocation,
        private api: ApiService) {
        this.loadData();
        this.checkLocationAuth();
        
        this.id = setInterval(() => {
            this.checkLocationAuth();
        }, 1000)
    }

    async loadData() {
        let getData = {
            access_token: localStorage.getItem('access_token')
        }

        this.api.getPrivacySetting(getData)
            .subscribe((resp: any) => {

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                let data = resp.data;
                this.notification = data.notification == '1' ? 1 : 0;
                this.personMsg = data.personal_msg == '1' ? 1 : 0;
                this.systemAnno = data.system_announce == '1' ? 1 : 0;
                this.walletUpdate = data.wallet_update == '1' ? 1 : 0;
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }

    checkLocationAuth() {
        this.backgroundGeolocation.checkStatus().then(data => {
            this.locationAuth = data.authorization;
        })
    }

    ionViewDidLeave() {
        clearInterval(this.id);
    }

    ngOnInit() {
    }

    showLocationSettings() {
        this.backgroundGeolocation.showAppSettings();
    }

    updateNotification() {
        this.personMsg = this.notification ? 0 : 1;
        this.systemAnno = this.notification ? 0 : 1;
        this.walletUpdate = this.notification ? 0 : 1;

        this.sendRequest({
            personal_msg: this.personMsg,
            notification: this.notification ? 0 : 1,
            system_announce: this.systemAnno,
            wallet_update: this.walletUpdate
        })
    }

    sendRequest(data: any) {
        data.access_token = localStorage.getItem('access_token');
        this.api.setPrivacySetting(data)
            .subscribe((resp: any) => {
                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                this.loadData();
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }

    updateWallet() {
        this.sendRequest({ wallet_update: this.walletUpdate ? 0 : 1 });
    }

    updatePersonalMessage() {
        this.sendRequest({ personal_msg: this.personMsg ? 0 : 1 });
    }

    updateAnnounce() {
        this.sendRequest({ system_announce: this.systemAnno ? 0 : 1 });
    }
}
