import { Injectable } from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { CommonService } from './common.service';
import { environment } from '../environments/environment';

declare var cordova: any;
@Injectable({
    providedIn: 'root'
})
export class ThirdPartyService {

    constructor(private emailComposer: EmailComposer,
        private common: CommonService) {
    }

    async openEmail(order = '') {
        let email = {
            app: 'mailto',
            to: 'service@lichenads.com',
            subject: '「里程」我要聯絡客服' + (order ? ' 訂單序號' + order : ''),
            body: '我們非常注重您的使用回饋，請將您的想法告訴我們吧！',
            isHtml: false
        }

        cordova.plugins.email.hasAccount(flag => {
            if(flag) {
                this.emailComposer.open(email);
            }else {
                this.common.showDialog('訊息', '請先下載MAIL APP並設置郵件帳號');
            }
        })
    }

    openLine() {
        cordova.InAppBrowser.open('line://ti/p/' + environment.lineId, '_system', 'location=yes');
    }
}
