import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { CommonService } from '../common.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-notification-detail',
    templateUrl: './notification-detail.page.html',
    styleUrls: ['./notification-detail.page.scss'],
})
export class NotificationDetailPage implements OnInit {
    type: number;
    item: any;
    url: SafeResourceUrl;
    constructor(private router: Router,
        private sanitizer: DomSanitizer,
        private common: CommonService) {
        let state = this.router.getCurrentNavigation().extras.state

        if (!state) {
            this.router.navigate(['/tabs/notification']);
        }

        this.type = state.type;
        this.item = state.item;

    }

    ngOnInit() {
        if (this.type == 1 && this.item.type == 1) {
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.item.url);
        }
    }

    getContent(item): string {
        let content = this.common.format(item.content, item.params);

        if (content) {
            content = content.replace("\\n", '！');
        } else {
            content = '點擊檢視系統公告詳情！';
        }

        return content;
    }

}
