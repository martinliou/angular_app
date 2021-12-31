import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonService } from '../common.service';

@Component({
    selector: 'app-history-order',
    templateUrl: './history-order.page.html',
    styleUrls: ['./history-order.page.scss'],
})
export class HistoryOrderPage implements OnInit {

    historyData: any = [];
    constructor(private router: Router,
        private api: ApiService,
        private common: CommonService) {
        this.loadData();
    }

    ngOnInit() {
    }

    async loadData() {
        let getData = {
            access_token: localStorage.getItem('access_token')
        }
        await this.common.showSpinner(true);
        this.api.getHistoryOrder(getData)
            .subscribe((resp: any) => {
                this.common.showSpinner(false);

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                this.historyData = resp.data;
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }

    showDetail(item): void {
        let navigationExtras: NavigationExtras = {
            state: {
                id: item.id
            }
        }
        this.router.navigate(['/history-order-detail'], navigationExtras);
    }
}
