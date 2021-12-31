import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonService } from '../common.service';
import { filter } from 'rxjs/operators';
import { ActionSheetController } from '@ionic/angular';
import { ThirdPartyService } from '../third-party.service';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.page.html',
    styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

    userData: any = {};
    isLoading: boolean;
    constructor(private api: ApiService,
        private common: CommonService,
        private actionsheetCtrl: ActionSheetController,
        private thirdPartyService: ThirdPartyService,
        private router: Router) {
        this.loadData();

        //God damn Ionic 4 bug
        router.events.pipe(
            filter(event => event instanceof NavigationStart)
        ).subscribe((route: NavigationStart) => {
            if (route.url == '/tabs/setting') {
                this.loadData();
            }
        });

    }

    async loadData() {
        let getData = {
            access_token: localStorage.getItem('access_token')
        }

        this.api.getUserInfo(getData)
            .subscribe((resp: any) => {

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                this.userData = resp.data;

                if (this.userData.hasOwnProperty('photo_thumb_url')) {
                    this.userData.photo_thumb_url = this.userData.photo_thumb_url + '?time=' + Math.random() * 1000;
                }
            }, async err => {
                this.common.showHttpError(err);
            });
    }

    ngOnInit() {
    }

    editPerson(): void {
        this.router.navigate(['/person-edit']);
    }

    showAbout() {
        this.router.navigate(['/document']);
    }

    showPrivacy() {
        this.router.navigate(['/privacy'])
    }

    async showHelp(): Promise<any> {
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
