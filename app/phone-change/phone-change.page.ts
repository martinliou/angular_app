import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Firebase } from '@ionic-native/firebase/ngx';
import { auth } from 'firebase';
import { CommonService } from '../common.service';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-phone-change',
    templateUrl: './phone-change.page.html',
    styleUrls: ['./phone-change.page.scss'],
})
export class PhoneChangePage implements OnInit {
    phone: string;
    verifyCode: string;
    verifyRequire: boolean;
    credential: any;

    constructor(public firebase: Firebase,
        public platform: Platform,
        private api: ApiService,
        private common: CommonService,
        private location: Location,
        private router: Router) {
        this.phone = '';
        this.verifyCode = '';
        this.verifyRequire = true;
    }

    ngOnInit() {
    }


    fetchVerifyCode(): void {
        this.platform.ready().then(async () => {
            if (this.verifyRequire) {
                await this.common.showSpinner(true);
                this.firebase.verifyPhoneNumber('+886' + this.phone, 60).then(
                    async (credential) => {
                        this.credential = credential;
                        this.verifyRequire = false;
                        await this.common.showDialog('訊息', '已發送認證簡訊，請輸入驗證碼！');
                        await this.common.showSpinner(false);
                    })
                    .catch(async (err) => {
                        await this.common.showSpinner(false);
                        if (err == 'Invalid phone number') {
                            await this.common.showDialog('警告', '請輸入合法手機號碼！');
                        } else {
                            this.showVerifyErrorDialog();
                        }
                    });
            } else {
                await this.common.showSpinner(true);

                if (!this.credential) {
                    this.showVerifyErrorDialog();
                    return;
                }

                let signInCredential = null;
                try {
                    signInCredential = auth.PhoneAuthProvider.credential(this.credential.verificationId, this.verifyCode);
                } catch {
                    this.showVerifyErrorDialog();
                    return;
                }

                auth().signInWithCredential(signInCredential).then(async (info) => {

                    try {

                        this.firebase.getToken().then(async (token) => {
                            let postData = {
                                phone_number: info.user.phoneNumber,
                                uid: info.user.uid,
                                device_token: token,
                                access_token: localStorage.getItem('access_token')
                            }

                            this.api.updatePhoneNumber(postData)
                                .subscribe(async (resp: any) => {
                                    this.common.showSpinner(false);

                                    if (resp.status == -2) {
                                        this.common.backToLogin();
                                        return;
                                    }

                                    await this.common.showDialog('成功', '已更新您的手機號碼！', () => {
                                        this.location.back();
                                    })
                                }, async err => {
                                    this.common.showSpinner(false);
                                    this.common.showHttpError(err);
                                });
                        });
                    } catch {
                        this.showVerifyErrorDialog();
                        return;
                    }

                    this.verifyRequire = false;
                }, async (error) => {
                    this.showVerifyErrorDialog();
                    return;
                });
            }
        });
    }

    async showVerifyErrorDialog(): Promise<void> {
        await this.common.showSpinner(false);
        await this.common.showDialog('警告', '手機驗證失敗！');
    }
}
