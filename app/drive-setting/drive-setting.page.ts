import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { CommonService } from '../common.service';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-drive-setting',
    templateUrl: './drive-setting.page.html',
    styleUrls: ['./drive-setting.page.scss'],
})
export class DriveSettingPage implements OnInit {
    driveDays: number;
    prefData: any = [];
    slideOpts = {
        initialSlide: 0,
        speed: 400,
    };
    @ViewChild('slide') slides: IonSlides;

    constructor(private common: CommonService,
        private api: ApiService,
        private router: Router,
        private location: Location) {
        this.driveDays = 0;
        this.loadData();
    }

    async loadData() {
        await this.common.showSpinner(true);

        this.api.getDrivePrefs()
            .subscribe(async (resp: any) => {
                await this.common.showSpinner(false);

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                this.prefData = resp.data;

                for (let item of this.prefData) {
                    for (let option of item.options) {
                        option.checked = false;
                    }
                }
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }

    ngOnInit() {
        this.slides.lockSwipes(true);
    }

    async nextSlide(item = null) {
        if (item) {
            let leastOneItemChecked = false;
            for (let option of item.options) {
                if (option.checked) {
                    leastOneItemChecked = true;
                    break;
                }
            }

            if (!leastOneItemChecked) {
                await this.common.showToast('請至少選擇一項！');
                return;
            }
        }

        this.slides.lockSwipes(false);
        this.slides.slideNext();
        this.slides.lockSwipes(true);
    }

    prevSlide(): void {
        this.slides.lockSwipes(false);
        this.slides.slidePrev();
        this.slides.lockSwipes(true);
    }

    async complete() {
        let prefIds = [];
        for (let item of this.prefData) {
            for (let option of item.options) {
                if (option.checked) {
                    prefIds.push(option.id);
                }
            }
        }

        let postData = {
            option_ids: JSON.stringify(prefIds),
            access_token: localStorage.getItem('access_token')
        };

        await this.common.showSpinner(true);
        this.api.updateUserDrivePref(postData)
            .subscribe((resp: any) => {
                this.common.showSpinner(false);

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                if (resp.status == 0) {
                    this.common.showDialog('成功',
                        '已完成開車設定！',
                        () => {
                            this.location.back();
                        });
                } else {
                    this.common.showDialog('失敗',
                        '開車設定處理失敗！',
                        () => {
                            this.location.back();
                        });
                }
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }

    radioChange(options, option) {
        for (let item of options) {
            if (item == option) {
                item.checked = true;
            } else {
                item.checked = false;
            }
        }
    }
}
