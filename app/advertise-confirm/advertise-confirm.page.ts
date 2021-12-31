import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonService } from '../common.service';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { ThirdPartyService } from '../third-party.service';

@Component({
    selector: 'app-advertise-confirm',
    templateUrl: './advertise-confirm.page.html',
    styleUrls: ['./advertise-confirm.page.scss'],
})
export class AdvertiseConfirmPage implements OnInit {
    id: any;
    pickerOptions: any;
    chooseDate: any;
    chooseTime: any;
    chooseLocation: any;
    locations = [];
    locationInterfaceOptions: any;
    minDate: string;

    constructor(private common: CommonService,
        private api: ApiService,
        private actionsheetCtrl: ActionSheetController,
        private thirdPartyService: ThirdPartyService,
        private router: Router) {
        let state = this.router.getCurrentNavigation().extras.state

        if (!state) {
            this.router.navigate(['/tabs/advertise']);
        }

        let date = new Date();
        date.setDate(date.getDate() + 3);
        this.minDate = date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) + '-' + ('00' + date.getDate()).slice(-2);
        this.id = state.id;
        this.pickerOptions = {
            buttons: [{
                text: '取消',
            }, {
                text: '請選擇日期',
                cssClass: 'trans-action-btn-style',
                handler: () => {
                    return false;
                }
            }, {
                text: '確認',
                handler: (e) => {
                    this.chooseDate = e.year.value + '-' +
                        e.month.value + '-' + e.day.value;
                }
            }]
        };

        this.locationInterfaceOptions = {
            cssClass: 'location-style'
        }

        this.loadData();
    }

    async loadData() {
        await this.common.showSpinner(true);
        this.api.getAdvLocations()
            .subscribe((resp: any) => {
                if (resp.status == -2) {
                    this.router.navigate(['login']);
                    return;
                }

                this.common.showSpinner(false);
                this.locations = resp.data;
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }

    ngOnInit() {
    }

    async confirm() {
        if (!this.chooseTime ||
            !this.chooseDate ||
            !this.chooseLocation) {
            this.common.showToast('需選擇安裝日期、時間與地點！');
            return;
        }

        let postData = {
            access_token: localStorage.getItem('access_token'),
            install_date: this.chooseDate,
            install_time: this.chooseTime,
            loc_id: this.chooseLocation,
            adv_id: this.id
        };

        await this.common.showSpinner(true);
        this.api.addMission(postData)
            .subscribe((resp: any) => {
                this.common.showSpinner(false);

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                let title = '';
                let message = '';

                if (resp.status == 0) {
                    title = '成功';
                    message = '廣告申請成功，請於指定日期與時間前往指定地址，並請記得攜帶本手機！';
                } else if (resp.status == 2) {
                    title = '失敗';
                    message = '您已有正在進行中之任務！';
                } else {
                    title = '失敗';
                    message = '廣告申請失敗，請速與客服聯繫！';
                }

                this.common.showDialog(title,
                    message,
                    () => {
                        this.router.navigate(['/tabs/advertise']);
                    });
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            })
    }

    async showHelp() {
        const actionSheet = await this.actionsheetCtrl.create({
            mode: 'ios',
            buttons: [{
                text: 'Email',
                handler: () => {
                    this.thirdPartyService.openEmail();
                }
            }, {
                text: 'Line@',
                handler: () => {
                    this.thirdPartyService.openLine();
                }
            }, {
                text: '取消',
                role: 'cancel',
                handler: () => {
                }
            }]
        });

        actionSheet.present();
    }
}
