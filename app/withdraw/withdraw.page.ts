import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonService } from '../common.service';
import { AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-withdraw',
    templateUrl: './withdraw.page.html',
    styleUrls: ['./withdraw.page.scss'],
})
export class WithdrawPage implements OnInit {

    withdraw_avail_times: number;
    bankData: any;
    withdraw: number;
    balance: number;
    defaultBankID: number;
    hasMission: Boolean;
    platform: string;

    constructor(private api: ApiService,
        private router: Router,
        private common: CommonService,
        private pl: Platform,
        private alertCtrl: AlertController) {
        this.withdraw_avail_times = 0;
        this.hasMission = false;
        this.bankData = {
            bank_name: '未知銀行',
            bank_account: '未知帳號'
        };
        this.defaultBankID = -1;
        this.withdraw = 0;
        this.balance = 0;

        if(this.pl.is('ios')) {
            this.platform = 'ios';
        }else {
            this.platform = 'md';
        }
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.loadData();
    }

    async loadData() {
        await this.common.showSpinner(true);
        this.api.getUserBalance(localStorage.getItem('access_token'))
            .subscribe((resp: any) => {
                this.common.showSpinner(false);

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                let data = resp.data;
                this.withdraw_avail_times = data.withdraw_avail_times;
                this.hasMission = data.has_mission;
                for (let item of data.bank) {
                    if (item.is_default == '1' && item.accept_status == '1') {
                        this.defaultBankID = item.id;
                        this.bankData.bank_name = item.bank_name;
                        this.bankData.bank_account = item.bank_account.substr(-4, 4);
                        break;
                    }
                }

                this.balance = data.balance;
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }

    changeWithdraw(ev): void {
        if (ev.detail.checked) {

            let balance = this.balance;

            if (this.withdraw_avail_times == 0) {
                balance -= 15;
            }

            if (this.hasMission) {
                balance -= 100;
            }

            if (balance < 0) balance = 0;

            this.withdraw = balance;
        } else {
            this.withdraw = 0;
        }
    }

    async showHelp() {
        await this.common.showDialog('資訊', '每周皆有一次免費提領額度，超過則收取15元手續費！');
    }

    async confirm() {
        if (this.defaultBankID == -1) {
            await this.common.showToast('請選擇預設帳號！');
            return;
        }

        if (this.withdraw <= 0 || !this.isInt(this.withdraw)) {
            await this.common.showToast('請輸入合法提款金額！');
            return;
        }

        let balance = this.balance;
        let errMsg = '';

        if (this.withdraw_avail_times == 0) {
            balance -= 15;
            errMsg = '<br>1. 本週已用乙次免費提款額度，您需額外支付15元手續費';
        }

        if (this.hasMission) {
            balance -= 100;
            errMsg += '<br>' + (errMsg.length == 0 ? '1. ' : '2. ') + '目前仍有任務進行中，帳戶內需保留至少100元押金'
        }

        if (balance < 0) balance = 0;

        if (this.withdraw > balance) {
            let message = '提款金額超出餘額！';

            if (errMsg.length > 0) {
                message = '您目前可提款之金額為$ ' + balance + '，原因如下：<br>' + errMsg;
            }

            await this.common.showDialog('警告', message);
            return;
        }

        if (this.withdraw_avail_times == 0) {
            const alert = await this.alertCtrl.create({
                message: '<b>本次提款會收取15元手續費，確定繼續？</b>',
                buttons: [
                    {
                        text: '取消',
                        role: 'cancel',
                        cssClass: 'primary',
                        handler: () => {
                        }
                    }, {
                        text: '確定',
                        handler: () => {
                            this.startWithdraw();
                        }
                    }
                ]
            });

            await alert.present();
        } else {
            this.startWithdraw();
        }
    }

    async startWithdraw() {
        await this.common.showSpinner(true);
        let postData = {
            access_token: localStorage.getItem('access_token'),
            amount: this.withdraw,
            user_bank_id: this.defaultBankID
        }

        this.api.addUserWithdraw(postData)
            .subscribe((resp: any) => {
                this.common.showSpinner(false);

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                if (resp.status == 0) {
                    this.common.showDialog('成功',
                        '您的提款已申請成功，請靜待3-5日等待行政人員處理！',
                        () => {
                            this.router.navigate(['/transaction']);
                        });
                } else {
                    this.common.showDialog('失敗', '您的提款申請失敗，請聯繫客服處理！',
                        () => {
                            this.router.navigate(['/transaction']);
                        });
                }

            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }

    isInt(value): Boolean {
        var x = parseFloat(value);
        return !isNaN(value) && (x | 0) === x;
    }
}
