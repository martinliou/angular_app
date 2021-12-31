import { Injectable } from '@angular/core';
import {
    LoadingController,
    ToastController,
    AlertController
} from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    loadingCtrl: any;

    isToastLoading: Boolean;

    constructor(public loadCtrl: LoadingController,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController,
        private router: Router) {
        this.isToastLoading = false;
    }

    async showSpinner(flag) {
        if (flag) {
            this.loadingCtrl = await this.loadCtrl.create({
                message: '載入中...',
                spinner: 'dots',
                animated: true,
                showBackdrop: true
            })
            await this.loadingCtrl.present();
        } else {
            try {
                this.loadingCtrl.dismiss();
            } catch {
            }
        }
    }

    async showToast(message: string, duration: number = 1000) {
        if (this.isToastLoading) return;

        this.isToastLoading = true;
        const toast = await this.toastCtrl.create({
            message: message,
            duration: duration,
            position: 'top',
            mode: 'ios',
            color: 'dark'
        });
        toast.present();
        toast.onDidDismiss().then(() => {
            this.isToastLoading = false;
        });
    }

    async showDialog(title: string, message: string, callback = null) {
        const alert = await this.alertCtrl.create({
            header: title,
            message: message,
            buttons: [{
                text: 'OK',
                handler: callback
            }]
        });

        await alert.present();
    }

    backToLogin() {
        this.showToast('需重新登入！');
        this.router.navigate(['login']);
    }

    format(text, params) {
        if (!params) return text;

        var param = [];
        for (var i = 0, l = params.length; i < l; i++) {
            param.push(params[i]);
        }

        let count = 0;
        return text.replace(/\{(\d+)\}|(%s)/g, function (m, n) {
            return param[count++];
        });
    }

    showHttpError(err) {
        return this.showDialog('錯誤', '網路連線出現錯誤，請檢查您的網路狀態或與客服聯繫！');
    }
}

@Injectable({
    providedIn: 'root'
})
export class ConstantProvider {
    public static bleSetup = '請確認手機訊號順暢，開啟里程App後，需與廣告車輛上之無線設備保持一定的距離內，等待並與車上無線設備與App連線，直到右側藍芽icon亮燈狀態後，表示連線完成。';
    public static bleDevice = '請確認手機訊號順暢，開啟里程App並靠近車上無線設備，即會自動連線。若沒有反應時，請重新開啟App，並按下無線裝置按鈕，重新連線。';
    public static aboutUs = '里程（LiChen）是一家提供廣告媒合平台服務的公司。車主可以透過里程App，從廣告任務清單上選擇想要承接的廣告，向廣告主提出接案申請，里程廣告平台媒合車主與廣告主廣告託刊服務，並以行駛里程計費，創造廣告主與車主雙贏。<br>一般使用者可以透過平台註冊成為合作夥伴提供車輛刊登廣告服務，而廣告主可以透過里程公司上刊廣告到里程App廣告清單內，讓車主能清楚地看到每件廣告任務時間及報酬，一鍵輕鬆完成廣告接案的預約、上刊、賺錢的步驟。<br>我們以創新的商業媒合廣告模式，解決中小企業廣告主資金不足無法負擔大筆廣告行銷費用，每筆廣告以里程計費，清楚的知道每一塊錢廣告的曝光效果。'
    public static historyQA = [{
        title: '公里數不正確', content: '請確認手機訊號順暢，開啟里程App並與車上無線設備保持連線，右側藍芽icon亮燈狀態下，車輛行駛移動時才會予以計算里程。'
    }, {
        title: '路線不正確', content: '請確認手機訊號順暢，無遮蔽物遮擋手機ＧＰＳ訊號。手機ＧＰＳ訊號可能受到以下因素干擾：移動速度過快或行駛於橋樑下、涵洞、隧道、天氣不佳及磁場等其他原因。'
    }, {
        title: '尚未入帳', content: '里程的報酬發放為系統會統一固定的時間透過銀行匯款到您個人的帳戶中，請耐心等待或與客服聯繫。'
    }, {
        title: '無線裝置無法連線', content: '可能因為裝置沒電或受潮等原因造成作動不良或損壞，請重開里程App在連線一次，若仍無法連線請與客服聯繫。'
    }, {
        title: '廣告毀損', content: '若為材質或安裝上瑕疵，我們將會免費替您更換。若為人為因素損壞，重新上刊廣告則需酌收材料成本。'
    }, {
        title: '無線設備毀損', content: '若為材質或安裝上瑕疵，我們將會免費替您更換。若為人為因素損壞，重新上刊廣告則需酌收材料成本。'
    }, {
        title: '100元押金用來做什麼', content: '為了方便車主在第一次廣告上刊方便，我們會先替您代墊100元押金用來購買車上的無線裝置，以避部分車主免安裝無線裝置後沒有讓車輛正常的移動曝光。完成第一次廣告上刊後，我們會在您的帳戶內顯示-100元，並將在下次的報酬結算中扣除。'
    }, {
        title: '帳戶被停權', content: '當系統偵測到帳戶有以下幾種不當使用行為時，帳戶即會遭受停權：<br>1 詐騙或影響交易安全<br>2 經認證之手機號碼持續連繫未果<br>3 擾亂平台或使用者之行為<br>4 刻意破壞無線裝置或廣告<br>5 其他危害到平台的行為'
    }, {
        title: '申請提款需要費用嗎', content: '我們提供每個月一次提款免費，超過的部分，依照各家銀行規定收取轉帳手續費用。'
    }]
}