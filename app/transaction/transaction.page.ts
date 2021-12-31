import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonService } from '../common.service';
import { AlertController, Platform } from '@ionic/angular';

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction.page.html',
    styleUrls: ['./transaction.page.scss'],
})
export class TransactionPage implements OnInit {
    transactionData: any = [];
    startYear: number;
    startMonth: number;
    startDay: number;
    endYear: number;
    endMonth: number;
    endDay: number;
    expenditure: number;
    income: number;
    startPickerOptions: any;
    endPickerOptions: any;
    readonly ADV_TYPE = 0;
    readonly WITHDRAW_TYPE = 1;
    @ViewChild('startDate') startDate;
    @ViewChild('endDate') endDate;

    constructor(private router: Router,
        private alertCtrl: AlertController,
        private common: CommonService,
        private platform: Platform,
        private api: ApiService) {
        this.expenditure = 0;
        this.income = 0;
        this.startPickerOptions = {
            buttons: [{
                text: '取消'
            }, {
                text: '請選擇起始時間',
                cssClass: 'trans-action-btn-style',
                handler: () => {
                    return false;
                }
            }, {
                text: '確認',
                handler: (ev) => {
                    this.startYear = ev.year.value;
                    this.startMonth = ev.month.value;
                    this.startDay = ev.day.value;
                    this.endDate.open();
                }
            }]
        };

        this.endPickerOptions = {
            buttons: [{
                text: '',
                handler: () => {
                    return false;
                }
            }, {
                text: '請選擇結束時間',
                cssClass: 'trans-action-btn-style',
                handler: () => {
                    return false;
                }
            }, {
                text: '確認',
                handler: (ev) => {
                    this.endYear = ev.year.value;
                    this.endMonth = ev.month.value;
                    this.endDay = ev.day.value;

                    let startDayFmt = this.startYear + '-' +
                        this.startMonth + '-' +
                        this.startDay;

                    let endDayFmt = this.endYear + '-' +
                        this.endMonth + '-' +
                        this.endDay;

                    let getData = {
                        started_at: startDayFmt,
                        ended_at: endDayFmt
                    };

                    this.loadData(getData);
                }
            }]
        }

        this.resetDateToDefault();
        this.loadData();
    }

    ngOnInit() {
    }

    navigateBack(): void {
        this.router.navigate(['/tabs/wallet']);
    }

    async loadData(requiredData = {}) {
        let getData = {
            access_token: localStorage.getItem('access_token')
        };

        let optionalFields = ['type', 'started_at', 'ended_at'];
        for (let item of optionalFields) {
            if (requiredData.hasOwnProperty(item)) {
                getData[item] = requiredData[item];
            }
        }

        await this.common.showSpinner(true);
        this.api.getTransaction(getData)
            .subscribe((resp: any) => {
                this.common.showSpinner(false);

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                this.transactionData = resp.data;

                this.expenditure = 0;
                this.income = 0;
                for (let item of this.transactionData) {
                    if (item.type == this.WITHDRAW_TYPE) {
                        this.expenditure += item.amount;
                    } else {
                        this.income += (Math.round(parseFloat(item.amount)));
                    }
                }
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }

    viewDetail(item): void {
        if (item.type == 0) {
            let navigationExtras: NavigationExtras = {
                state: {
                    id: item.id
                }
            }
            this.router.navigate(['/history-order-detail'], navigationExtras);
        } else {
            let navigationExtras: NavigationExtras = {
                state: {
                    item: item
                }
            }
            this.router.navigate(['/transaction-detail'], navigationExtras);
        }
    }

    async showCategory() {
        const alert = await this.alertCtrl.create({
            header: '請選擇類型',
            inputs: [
                {
                    name: 'all',
                    type: 'radio',
                    label: '檢視全部',
                    value: -1,
                    checked: true
                },
                {
                    name: 'advertise',
                    type: 'radio',
                    label: '廣告訂單',
                    value: 0
                },
                {
                    name: 'withdraw',
                    type: 'radio',
                    label: '提款',
                    value: 1
                }
            ],
            buttons: [
                {
                    text: '取消',
                    role: 'cancel'
                }, {
                    text: '確定',
                    handler: (sel) => {
                        this.resetDateToDefault();
                        this.loadData({ type: sel });
                    }
                }
            ]
        });
        await alert.present();
    }

    resetDateToDefault(): void {
        let date = new Date();
        this.startYear = date.getFullYear();
        this.startMonth = date.getMonth() + 1;
        this.startDay = -1;
        this.endYear = -1;
        this.endMonth = -1;
        this.endDay = -1;
    }

    showCalender(): void {
        this.startDate.open();
    }
}
