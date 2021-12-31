import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { EulaPopoverComponent } from '../eula-popover/eula-popover.component';

@Component({
    selector: 'app-user-pref',
    templateUrl: './user-pref.page.html',
    styleUrls: ['./user-pref.page.scss'],
})
export class UserPrefPage implements OnInit {

    prefData = [];
    eula: any;
    constructor(private common: CommonService,
        private api: ApiService,
        private router: Router,
        private alertCtrl: AlertController) {
        this.loadData();
    }

    async loadData() {
        await this.common.showSpinner(true);

        this.api.getDrivePrefs()
            .subscribe(async (resp: any) => {
                await this.common.showSpinner(false);

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }
                this.prefData = resp.data;
                this.eula = resp.eula;
                for (let item of this.prefData) {
                    for (let option of item.options) {
                        option.checked = false;
                    }
                }
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }

    ngOnInit() {
    }

    async agree() {
        const alert = await this.alertCtrl.create({
            message: this.eula,
            backdropDismiss: false,
            cssClass: 'eula',
            buttons: [{
                text: '同意',
                handler: () => {
                    this.complete();
                }
            }, {
                text: '不同意',
                role: 'cancel'
            }]
        });

        await alert.present();
    }

    async complete() {
        let prefIds = [];
        for (let item of this.prefData) {
            for (let option of item.options) {
                if (option.checked) {
                    prefIds.push(option.id);
                }
            }
        }

        let postData = {
            option_ids: JSON.stringify(prefIds),
            access_token: localStorage.getItem('access_token')
        };

        await this.common.showSpinner(true);
        this.api.updateUserDrivePref(postData)
            .subscribe((resp: any) => {
                this.common.showSpinner(false);

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                if (resp.status == 0) {
                    this.common.showDialog('成功',
                        '已完成問卷調查！',
                        () => {
                            this.router.navigate(['/tabs/advertise']);
                        });
                } else {
                    this.common.showDialog('失敗',
                        '問卷調查處理失敗！',
                        () => {
                            this.router.navigate(['/tabs/advertise']);
                        });
                }
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }

    radioChange(options, option) {
        for (let item of options) {
            if (item == option) {
                item.checked = true;
            } else {
                item.checked = false;
            }
        }
    }
}
