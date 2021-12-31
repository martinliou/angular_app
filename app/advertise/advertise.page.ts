import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { CommonService } from '../common.service';
import { PopoverController } from '@ionic/angular';
import { AdvPopoverComponent } from '../adv-popover/adv-popover.component';

@Component({
    selector: 'app-advertise',
    templateUrl: './advertise.page.html',
    styleUrls: ['./advertise.page.scss'],
})
export class AdvertisePage implements OnInit {

    hasMission: Boolean;
    advertiseData: any;
    curAdvData: any = [];
    state: any;
    tags: any = [];
    curTags: any = [];
    ttype: Number = 0;

    constructor(private router: Router,
        private api: ApiService,
        private popCtrl: PopoverController,
        private common: CommonService) {
        this.hasMission = false;
        this.advertiseData = [];
        this.state = this.router.getCurrentNavigation().extras.state;

        if (this.state) {
            this.advertiseData = this.state.advertises;
            this.hasMission = this.state.hasMission;
            this.tags = this.state.tags;
            this.getCurTags(0);
        } else {
            this.loadData();
        }

        //God damn Ionic 4 bug
        router.events.pipe(
            filter(event => event instanceof NavigationStart)
        ).subscribe((route: NavigationStart) => {
            if (route.url == '/tabs/advertise') {
                this.loadData();
            }
        });
    }

    ngOnInit() {
    }

    async loadData() {
        this.advertiseData = [];
        let getData = {
            access_token: localStorage.getItem('access_token')
        }

        this.api.getAdvertise(getData)
            .subscribe(async (resp: any) => {

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                this.advertiseData = resp.data;
                this.hasMission = resp.has_mission;
                this.tags = resp.tags;
                this.getCurTags(0);
            }, async err => {
                this.common.showHttpError(err);
            });
    }

    async firstShowDialog() {
        if (!localStorage.getItem('first_init_adv')) {
            localStorage.setItem('first_init_adv', '1');

            const popover = await this.popCtrl.create({
                component: AdvPopoverComponent,
                backdropDismiss: false,
                cssClass: 'adv-popover'
            });
            return await popover.present();
        }
    }

    switchType(t) {
        this.ttype = t;
        this.getCurTags(t);

        if (t == 1) {
            this.firstShowDialog();
        }
    }

    getCurTags(choice) {
        this.curTags = [];

        for (let item of this.tags) {
            if (item.ttype == choice) {
                this.curTags.push(item);
            }
        }

        let cur = 0;
        let chkIdx = -1
        for (let item of this.curTags) {
            if (item.enabled == '1') {
                if (chkIdx == -1) {
                    chkIdx = cur;
                }
            }

            ++cur;
        }

        cur = 0;
        for (let item of this.curTags) {
            if (chkIdx != cur) {
                item.checked = 0;
            } else {
                item.checked = 1;
            }

            ++cur;
        }

        this.curAdvData = [];
        if (chkIdx != -1) {
            for (let item of this.advertiseData) {
                if (item.vehicle_pos == chkIdx && item.vehicle_type == this.ttype) {
                    this.curAdvData.push(item);
                }
            }
        }
    }

    segmentChanged(e): void {
        this.curAdvData = [];
        for (let item of this.advertiseData) {
            if (item.vehicle_pos == e.detail.value && item.vehicle_type == this.ttype) {
                this.curAdvData.push(item);
            }
        }
    }

    viewDetail(item): void {

        let navigationExtras: NavigationExtras = {
            state: {
                item: item,
                hasMission: this.hasMission
            }
        }

        this.router.navigate(['/advertise-detail'], navigationExtras);
    }
}