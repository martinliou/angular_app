import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Firebase } from '@ionic-native/firebase/ngx';
import { auth } from 'firebase';
import { CommonService } from '../common.service';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    phone: string;
    verifyCode: string;
    verifyRequire: boolean;
    credential: any;

    constructor(public firebase: Firebase,
        public platform: Platform,
        private api: ApiService,
        private common: CommonService,
        private router: Router) {
        this.verifyRequire = true;
        this.verifyCode = '';
        this.phone = '';
    }

    ngOnInit() {
    }

    async fetchVerifyCode() {
        if (this.verifyRequire) {
            if (this.phone.length <= 8) {
                await this.common.showDialog('警告', '輸入電話格式錯誤');
                return;
            }

            await this.common.showSpinner(true);
            auth().settings.appVerificationDisabledForTesting = true;

            this.firebase.verifyPhoneNumber('+886' + this.phone, 60).then(
                async (credential) => {
                    await this.common.showSpinner(false);
                    this.credential = credential;
                    this.verifyRequire = false;
                })
                .catch(async (err) => {
                    await this.common.showSpinner(false);
                    this.showVerifyErrorDialog(err);
                });

        } else {
            await this.common.showSpinner(true);
            let verificationId = (typeof this.credential == 'string') ?
            this.credential: this.credential.verificationId;
            const signInCredential = auth.PhoneAuthProvider.credential(verificationId, this.verifyCode);
            auth().signInWithCredential(signInCredential).then(async (info) => {

                try {
                    this.firebase.getToken().then(async (token) => {
                        let postData = {
                            phone_number: info.user.phoneNumber,
                            uid: info.user.uid,
                            device_token: token
                        }
                        
                        console.log(postData);
                        this.api.login(postData)
                            .subscribe(async (resp: any) => {
                                this.common.showSpinner(false);

                                if (resp.status == -2) {
                                    this.common.backToLogin();
                                    return;
                                }

                                if (resp.status == 0) {
                                    localStorage.setItem('access_token', resp.access_token);
                                    if (resp.pref_count > 0) {
                                        this.router.navigate(['/tabs/advertise']);
                                    } else {
                                        this.router.navigate(['/user-pref']);
                                    }
                                } else if (resp.status == 3) {
                                    await this.common.showDialog('錯誤', '帳戶有問題，請與客服聯繫！');
                                } else {
                                    await this.common.showDialog('錯誤', '此帳戶不存在');
                                }
                            }, async err => {
                                console.log(err);
                                this.common.showSpinner(false);
                                this.common.showHttpError(err);
                            });
                    })


                } catch {
                    await this.common.showSpinner(false);
                    this.showVerifyErrorDialog();
                    return;
                }

                this.verifyRequire = false;
            }, async () => {
                await this.common.showSpinner(false);
                this.showVerifyErrorDialog();
                return;
            });
        }
    }


    async showVerifyErrorDialog(err = ''): Promise<void> {
        await this.common.showDialog('錯誤', '驗證帳號程序失敗，原因：' + err);
    }
}
