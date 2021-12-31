import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { CommonService } from '../common.service';

@Component({
    selector: 'app-advertise-detail',
    templateUrl: './advertise-detail.page.html',
    styleUrls: ['./advertise-detail.page.scss'],
})
export class AdvertiseDetailPage implements OnInit {
    item: any = null;
    btnDisabled: Boolean;
    hasMission: Boolean;
    constructor(private router: Router,
        private common: CommonService) {
        this.btnDisabled = true;
        let state = this.router.getCurrentNavigation().extras.state

        if (!state) {
            this.router.navigate(['/tabs/advertise']);
        }

        this.item = state.item;
        this.hasMission = state.hasMission;
    }

    ngOnInit() {
    }

    agree(ev): void {
        this.btnDisabled = !ev.detail.checked;
    }

    next() {
        if (this.hasMission) {
            this.common.showToast('您目前尚有未完成之任務！');
            return;
        }

        let navigationExtras: NavigationExtras = {
            state: {
                id: this.item.id
            }
        }

        this.router.navigate(['/advertise-confirm'], navigationExtras);
    }
}
