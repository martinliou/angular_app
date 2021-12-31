import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonService } from '../common.service';
import { Router, NavigationExtras, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.page.html',
    styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
    loadingCtrl: any;
    balance: string;

    constructor(private api: ApiService,
        private router: Router,
        private common: CommonService) {
        this.balance = '';
        this.loadData();

        //God damn Ionic 4 bug
        router.events.pipe(
            filter(event => event instanceof NavigationStart)
        ).subscribe((route: NavigationStart) => {
            if (route.url == '/tabs/wallet') {
                this.loadData();
            }
        });
    }

    ngOnInit() {
    }

    async loadData() {
        this.api.getUserBalance(localStorage.getItem('access_token'))
            .subscribe(async (resp: any) => {

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                let data = resp.data;
                this.balance = data.balance;
            }, async err => {
                this.common.showHttpError(err);
            });
    }
}
