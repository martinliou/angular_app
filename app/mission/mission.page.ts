import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonService } from '../common.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
    selector: 'app-mission',
    templateUrl: './mission.page.html',
    styleUrls: ['./mission.page.scss'],
})
export class MissionPage implements OnInit {

    missions = [];
    constructor(public api: ApiService,
        public common: CommonService,
        private router: Router) {
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.loadData();
    }
    
    async loadData() {
        await this.common.showSpinner(true);

        let getData = {
            access_token: localStorage.getItem('access_token')
        };

        this.api.getMissions(getData)
            .subscribe((resp: any) => {
                this.common.showSpinner(false);

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                this.missions = resp.data;
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }

    showDetail(item): void {
        let navigationExtras: NavigationExtras = {
            state: {
                item: item
            }
        }
        this.router.navigate(['/mission-detail'], navigationExtras);
    }
}
