import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonService } from '../common.service';
import { ConstantProvider } from '../common.service';
import { ThirdPartyService } from '../third-party.service';
import { ActionSheetController } from '@ionic/angular';

@Component({
    selector: 'app-history-order-detail',
    templateUrl: './history-order-detail.page.html',
    styleUrls: ['./history-order-detail.page.scss'],
})
export class HistoryOrderDetailPage implements OnInit {
    orderData = null;
    historyQA;

    constructor(private router: Router,
        private api: ApiService,
        private common: CommonService,
        private actionsheetCtrl: ActionSheetController,
        private thirdPartyService: ThirdPartyService) {
        let state = this.router.getCurrentNavigation().extras.state

        if (!state) {
            this.router.navigate(['/history-order']);
        }

        let id = state.id;
        this.historyQA = ConstantProvider.historyQA;
        this.loadData(id);
    }

    async loadData(id) {
        let getData = {
            access_token: localStorage.getItem('access_token'),
            id: id
        }
        await this.common.showSpinner(true);
        this.api.getHistoryOrder(getData)
            .subscribe((resp: any) => {
                this.common.showSpinner(false);

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                this.orderData = resp.data[0];
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }

    ngOnInit() {
    }

    viewDetail(item): void {
        this.common.showDialog('', item.content);
    }

    async showHelp() {
        let order = 'C' + this.pad(this.orderData.mission_id, 8, '0') + '-' + this.orderData.order_id;
        const actionSheet = await this.actionsheetCtrl.create({
            mode: 'ios',
            buttons: [{
                text: 'Email',
                handler: () => {
                    this.thirdPartyService.openEmail(order);
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

    pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
}
