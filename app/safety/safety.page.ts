import { Component, OnInit } from '@angular/core';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';
import { ApiService } from '../api.service';
import { ThirdPartyService } from '../third-party.service';

@Component({
    selector: 'app-safety',
    templateUrl: './safety.page.html',
    styleUrls: ['./safety.page.scss'],
})
export class SafetyPage implements OnInit {

    constructor(private alertCtrl: AlertController,
        private router: Router,
        private api: ApiService,
        private actionsheetCtrl: ActionSheetController,
        private thirdPartyService: ThirdPartyService,
        private common: CommonService) { }

    ngOnInit() {
    }

    async deleteAccount() {
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
