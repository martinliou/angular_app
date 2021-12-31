import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonService } from '../common.service';

@Component({
    selector: 'app-bank-account-detail',
    templateUrl: './bank-account-detail.page.html',
    styleUrls: ['./bank-account-detail.page.scss'],
})
export class BankAccountDetailPage implements OnInit {
    bankData: any = {};
    requiredData: any = {};

    constructor(private router: Router,
        public api: ApiService,
        public common: CommonService) {
        let state = this.router.getCurrentNavigation().extras.state

        if (!state) {
            this.router.navigate(['/bank-account']);
        }

        this.bankData = state.bankData;

        this.requiredData = [{
            title: '銀行帳號全名', content: this.bankData.account_name
        }, {
            title: '身分證字號', content: this.bankData.id_card_number
        }, {
            title: '銀行帳號', content: this.bankData.bank_account
        }, {
            title: '銀行名稱', content: this.bankData.bank_name
        }, {
            title: '地區', content: this.bankData.bank_county_name
        }, {
            title: '分行', content: this.bankData.branch_name
        }]
    }

    async setAsDefault() {
        let postData = {
            access_token: localStorage.getItem('access_token'),
            id: this.bankData.id,
            is_default: 1
        };

        await this.common.showSpinner(true);
        this.api.editBankAccount(postData)
            .subscribe((resp: any) => {
                this.common.showSpinner(false);

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                if (resp.status == 0) {
                    this.common.showDialog('成功',
                        '此銀行帳號已設為預設！',
                        () => {
                            this.router.navigate(['/bank-account']);
                        });
                } else {
                    this.common.showDialog('失敗',
                        '設定失敗！',
                        () => {
                            this.router.navigate(['/bank-account']);
                        });
                }
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }

    ngOnInit() {
    }

}