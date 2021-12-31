import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonService } from '../common.service';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.page.html',
    styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

    notifyType: string;
    notifyArrs = ['personInfo', 'systemAnno', 'walletUpdate'];
    personInfoData = [];
    systemAnnoData = [];
    walletUpdateData = [];

    constructor(
        private router: Router,
        private common: CommonService,
        private api: ApiService
    ) {
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.notifyType = 'personInfo';
        this.personInfoData = [];
        this.systemAnnoData = [];
        this.walletUpdateData = [];

        this.loadPersonData();
        setTimeout(() => {
            this.loadSysAnnoData();
        }, 500);
        
        setTimeout(() => {
            this.loadWalletUpdateData();
        }, 1000);
    }

    async loadPersonData() {
        await this.common.showSpinner(true);
        let getData = {
            access_token: localStorage.getItem('access_token')
        }
        this.api.getPersonInfo(getData)
            .subscribe((resp: any) => {
                this.common.showSpinner(false);

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                this.personInfoData = resp.data;
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }

    async loadSysAnnoData() {
        let getData = {
            access_token: localStorage.getItem('access_token')
        }
        this.api.getSysAnno(getData)
            .subscribe((resp: any) => {
                this.systemAnnoData = resp.data;
            }, async err => {
                this.common.showHttpError(err);
            });
    }

    async loadWalletUpdateData() {
        let getData = {
            access_token: localStorage.getItem('access_token')
        }
        this.api.getWalletUpdate(getData)
            .subscribe((resp: any) => {
                this.walletUpdateData = resp.data;
            }, async err => {
                this.common.showHttpError(err);
            });
    }

    getContent(item): string {
        let content = this.common.format(item.content, item.params);

        if (content) {
            content = content.replace("\\n", '！');
        } else {
            content = '點擊檢視系統公告詳情！';
        }
        return content;
    }

    viewDetail(item, type): void {

        let navigationExtras: NavigationExtras = {
            state: {
                item: item,
                type: type
            }
        }

        this.router.navigate(['/notification-detail'], navigationExtras);
    }

    getThumbPhoto(item): string {
        let photos = item.photos;
        for (let photoItem of photos) {
            if (photoItem.type == 0) {
                return photoItem.photo_thumb_url;
            }
        }

        return '';
    }
}
