import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { CommonService } from '../common.service';
import { ApiService } from '../api.service';
import { ActionSheetController } from '@ionic/angular';
import { ThirdPartyService } from '../third-party.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-mission-detail',
    templateUrl: './mission-detail.page.html',
    styleUrls: ['./mission-detail.page.scss'],
})
export class MissionDetailPage implements OnInit {

    item: any = { advertise_details: {} };
    serial: string;
    constructor(private router: Router,
        private common: CommonService,
        private actionsheetCtrl: ActionSheetController,
        private thirdPartyService: ThirdPartyService,
        private location: Location,
        private api: ApiService) {
        this.serial = '';
        let state = this.router.getCurrentNavigation().extras.state

        if (!state) {
            this.router.navigate(['/mission']);
        }

        this.item = state.item;
    }

    ngOnInit() {
    }

    getProgressVal(item): number {
        let driveDist = item.drive_distance;
        let requiredDist = item.advertise_details.distance;

        try {
            if (driveDist >= requiredDist) {
                return 1.0;
            } else {
                return parseFloat(driveDist) / parseFloat(requiredDist);
            }
        } catch {
            return 0;
        }
    }

    getDistDesc(item): string {
        let driveDist = Math.round(item.drive_distance * 100) / 100;
        let requiredDist = item.advertise_details.distance;

        try {
            if (driveDist >= requiredDist) {
                return requiredDist + ' / ' + requiredDist;
            } else {
                return driveDist + ' / ' + requiredDist;
            }
        } catch {
            return '';
        }
    }

    requireShowCamera(item): Boolean {
        if (item.mission_status == '5' && item.upload_photo_flag == 0)
            return true;

        return false;
    }

    navigateUploadCamera(item): void {
        let navigationExtras: NavigationExtras = {
            state: {
                id: item.id
            }
        }
        this.router.navigate(['/mission-upload'], navigationExtras);
    }

    async confirmSerial() {
        if (this.serial.length != 6) {
            this.common.showToast('請輸入正確序號');
            return;
        }

        let postData = {
            access_token: localStorage.getItem('access_token'),
            id: this.item.id,
            verify_code: this.serial
        };

        await this.common.showSpinner(true);
        this.api.verifyMissionCode(postData)
            .subscribe((resp: any) => {
                this.common.showSpinner(false);

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                if (resp.status == 0) {
                    this.common.showDialog('成功',
                        '序號輸入正確，任務已開始計算！',
                        () => {
                            this.location.back();
                        });
                } else {
                    this.common.showDialog('失敗',
                        '序號輸入錯誤，請聯繫客服處理！',
                        () => {
                        });
                }
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }


    async showHelp() {
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
