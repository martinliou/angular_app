import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonService } from '../common.service';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-bank-account',
    templateUrl: './bank-account.page.html',
    styleUrls: ['./bank-account.page.scss'],
})
export class BankAccountPage implements OnInit {

    banks: any;
    platform: string;

    constructor(private router: Router,
        private api: ApiService,
        private pl: Platform,
        private common: CommonService) {
        if(this.pl.is('ios')) {
            this.platform = 'ios';
        }else {
            this.platform = 'md';
        }
    }

    ionViewWillEnter() {
        this.banks = [];
        this.loadData();
    }

    ngOnInit() {
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
                this.banks = data.bank;
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }

    viewDetail(item): void {
        let navigationExtras: NavigationExtras = {
            state: {
                bankData: item
            }
        }

        this.router.navigate(['/bank-account-detail'], navigationExtras);
    }
}
