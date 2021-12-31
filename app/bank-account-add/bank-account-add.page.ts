import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonService } from '../common.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
    selector: 'app-bank-account-add',
    templateUrl: './bank-account-add.page.html',
    styleUrls: ['./bank-account-add.page.scss'],
})
export class BankAccountAddPage implements OnInit {

    county: string;
    district: string;
    counties = [];
    districts = [];
    disableDistSel: Boolean;
    username: string;
    birthday: string;
    id_card_number: string;
    zip_code: string;
    address: string;

    constructor(public api: ApiService,
        public common: CommonService,
        public router: Router) {
        this.county = '-1';
        this.district = '-1';
        this.disableDistSel = true;
    }

    ngOnInit() {
        this.loadCounty();
    }

    async loadCounty() {
        await this.common.showSpinner(true);
        this.api.getCountyList()
            .subscribe((resp: any) => {
                this.common.showSpinner(false);

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                this.counties = resp.data.reverse();
            });
    }

    async changeCounty(ev) {
        await this.common.showSpinner(true);
        this.api.getDistrictList(ev.detail.value)
            .subscribe((resp: any) => {
                this.common.showSpinner(false);

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                this.districts = resp.data;
                this.district = '-1';
                this.disableDistSel = false;
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }

    next(): void {
        let requiredFields = [this.county, this.district, this.username,
        this.id_card_number, this.birthday, this.zip_code];

        for (let field of requiredFields) {
            if (!field) {
                this.common.showToast('所有欄位均需填寫！');
                return;
            }
        }

        if (!(/^\d{4}(0?[1-9]|1[012])(0?[1-9]|[12][0-9]|3[01])$/.test(this.birthday))) {
            this.common.showToast('生日格式有誤！(例: 20000101)');
            return;
        }

        if (!(/^[A-Za-z]\d{9}$/.test(this.id_card_number))) {
            this.common.showToast('身分證格式有誤！(例: A123456789)');
            return;
        }

        if (this.district == '-1' || this.county == '-1') {
            this.common.showToast('請選擇所在地區！');
            return;
        }

        if (!(/^\d+$/.test(this.zip_code))) {
            this.common.showToast('郵遞區號僅能包含數字！');
            return;
        }

        this.birthday = this.birthday.substr(0, 4) + '-' + this.birthday.substr(4, 2) + '-' + this.birthday.substr(6, 2);
        this.id_card_number = this.id_card_number.substr(0, 1).toUpperCase() + this.id_card_number.substr(1, 9);

        let personal_data = {
            username: this.username,
            birthday: this.birthday,
            id_card_number: this.id_card_number,
            zip_code: this.zip_code,
            address: this.address,
            county_id: this.county,
            district_id: this.district
        };

        let navigationExtras: NavigationExtras = {
            state: {
                personal_data: personal_data
            }
        }

        this.router.navigate(['/bank-account-add-next'], navigationExtras);
    }
}
