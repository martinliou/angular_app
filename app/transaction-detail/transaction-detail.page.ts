import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { ThirdPartyService } from '../third-party.service';

@Component({
    selector: 'app-transaction-detail',
    templateUrl: './transaction-detail.page.html',
    styleUrls: ['./transaction-detail.page.scss'],
})
export class TransactionDetailPage implements OnInit {

    trans_data: any = {};
    constructor(private router: Router,
        private actionsheetCtrl: ActionSheetController,
        private thirdPartyService: ThirdPartyService) {
        let state = this.router.getCurrentNavigation().extras.state;

        if (!state) {
            this.router.navigate(['/transaction']);
        }

        if (state.hasOwnProperty('item')) {
            this.trans_data = state.item;
        }
    }

    ngOnInit() {
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
