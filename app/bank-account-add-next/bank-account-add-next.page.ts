import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonService } from '../common.service';

@Component({
    selector: 'app-bank-account-add-next',
    templateUrl: './bank-account-add-next.page.html',
    styleUrls: ['./bank-account-add-next.page.scss'],
})
export class BankAccountAddNextPage implements OnInit {

    banks = [];
    bankInterfaceOptions: any;
    counties = [];
    branches = [];
    disableBranchSel: Boolean;
    bank_county_id: string;
    bank_id: string;
    branch_id: string;
    account_name: string;
    bank_account: string;
    personal_data = {};

    constructor(private router: Router,
        public api: ApiService,
        public common: CommonService) {
        let state = this.router.getCurrentNavigation().extras.state;

        if (!state) {
            this.router.navigate(['/bank-account-add']);
        }

        if (state.hasOwnProperty('personal_data')) {
            this.personal_data = state.personal_data;
        }

        this.bankInterfaceOptions = {
            cssClass: 'bank-style'
        }

        this.disableBranchSel = true;
        this.bank_id = '-1';
        this.bank_county_id = '-1';
        this.branch_id = '-1';
        this.account_name = '';
        this.bank_account = '';
    }

    ngOnInit() {
        this.loadData();
    }

    async loadData() {
        await this.common.showSpinner(true);
        this.api.getBankList()
            .subscribe((resp: any) => {
                this.common.showSpinner(false);

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                this.banks = resp.data;
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
        this.api.getCountyList()
            .subscribe((resp: any) => {
                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                this.counties = resp.data.reverse();
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }

    async changeBank(ev) {
        this.branch_id = '-1';
        this.disableBranchSel = true;
        await this.common.showSpinner(true);

        this.api.getBranchList(ev.detail.value)
            .subscribe((resp: any) => {
                this.common.showSpinner(false);

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                this.branches = resp.data;
                this.disableBranchSel = false;
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }

    async confirm() {

        if (!this.bank_account || !this.account_name) {
            this.common.showToast('所有欄位均需填寫！');
            return;
        }

        if (this.bank_id == '-1' || this.bank_county_id == '-1') {
            this.common.showToast('請選擇銀行與分行！');
            return;
        }

        if (this.bank_county_id == '-1') {
            this.common.showToast('請選擇銀行所在地區！');
            return;
        }

        let bankData = {
            access_token: localStorage.getItem('access_token'),
            bank_id: this.bank_id,
            bank_county_id: this.bank_county_id,
            branch_id: this.branch_id,
            account_name: this.account_name,
            bank_account: this.bank_account
        }

        let postData = Object.assign({}, bankData, this.personal_data);

        await this.common.showSpinner(true);
        this.api.addBankAccount(postData)
            .subscribe((resp: any) => {
                this.common.showSpinner(false);

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                if (resp.status == 0) {
                    this.common.showDialog('成功',
                        '銀行帳號已申請成功，請靜待3-5日等待行政人員處理！',
                        () => {
                            this.router.navigate(['/bank-account']);
                        });
                } else {
                    this.common.showDialog('失敗',
                        '銀行帳號申請失敗，請聯繫客服處理！',
                        () => {
                            this.router.navigate(['/bank-account']);
                        });
                }
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }
}
