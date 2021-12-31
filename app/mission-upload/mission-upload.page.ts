import { Component, OnInit, ViewChild } from '@angular/core';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from '@ionic-native/camera-preview/ngx';
import { CommonService } from '../common.service';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
    selector: 'app-mission-upload',
    templateUrl: './mission-upload.page.html',
    styleUrls: ['./mission-upload.page.scss'],
})
export class MissionUploadPage implements OnInit {

    cameraPreviewOpts: CameraPreviewOptions;
    @ViewChild('camera_row') cameraRow;
    showPhoto: Boolean;
    dimOfPhoto: any;
    photo: string;
    updatePhotoBase64: string;

    constructor(private cameraPreview: CameraPreview,
        private router: Router,
        private alertCtrl: AlertController,
        private common: CommonService,
        private api: ApiService) {
        this.showPhoto = false;
        this.photo = '';
        this.updatePhotoBase64 = '';
        this.dimOfPhoto = {};
    }

    ngOnInit() {
    }

    ionViewWillLeave() {
        this.cameraPreview.stopCamera().then(() => {
        }, (err) => { });
    }

    ionViewDidEnter() {
        let bondingClientRect = this.cameraRow.el.getBoundingClientRect();

        this.cameraPreviewOpts = {
            x: bondingClientRect.x,
            y: bondingClientRect.y,
            width: bondingClientRect.width,
            height: bondingClientRect.height,
            camera: 'rear',
            tapPhoto: false,
            tapToFocus: true,
        };

        this.cameraPreview.startCamera(this.cameraPreviewOpts).then(() => {
        }, async (err) => {
            await this.common.showDialog('警告', '開啟相機出現錯誤狀況！原因：' + err);
        });
    }

    takePhoto(): void {
        const pictureOpts: CameraPreviewPictureOptions = {
            width: 1080,
            height: 1920,
            quality: 100
        }

        this.cameraPreview.takePicture(pictureOpts).then((imageData) => {
            this.common.showToast('拍照已完成，可準備上傳！', 750);
            this.showPhoto = true;
            this.updatePhotoBase64 = imageData;
            this.photo = 'data:image/jpeg;base64,' + this.updatePhotoBase64;
            this.cameraPreview.stopCamera();
        }, (err) => {

        });
    }

    async uploadPhoto() {

        const alert = await this.alertCtrl.create({
            message: '<b>是否確認上傳照片？</b>',
            buttons: [
                {
                    text: '重拍',
                    role: 'cancel',
                    cssClass: 'primary',
                    handler: () => {
                        this.showPhoto = false;

                        this.cameraPreview.startCamera(this.cameraPreviewOpts).then(() => {
                        }, async (err) => {
                            await this.common.showDialog('警告', '開啟相機出現錯誤狀況！原因：' + err);
                        });
                    }
                }, {
                    text: '確定',
                    handler: () => {
                        this.startUpload();
                    }
                }
            ]
        });

        await alert.present();
    }

    async startUpload() {
        const formData = new FormData();
        formData.append('access_token', localStorage.getItem('access_token'));

        if (this.photo.startsWith('data:image')) {
            const byteString = window.atob(this.updatePhotoBase64);
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const int8Array = new Uint8Array(arrayBuffer);

            for (let i = 0; i < byteString.length; i++) {
                int8Array[i] = byteString.charCodeAt(i);
            }

            const blob = new Blob([int8Array], { type: 'image/jpeg' });
            formData.append('photo', blob, 'photo.jpg');
        }

        await this.common.showSpinner(true);
        this.api.uploadMissionPhoto(formData)
            .subscribe(async (resp: any) => {
                this.common.showSpinner(false);

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                if (resp.status == 0) {
                    await this.common.showDialog('成功', '已完成照片上傳程序。請靜待1-2天時間等待行政人員審核照片，結果會發再行發通知！', () => {
                        this.router.navigate(['/tabs/advertise']);
                    })
                } else {
                    await this.common.showDialog('失敗', '上傳照片失敗！', () => {
                        this.router.navigate(['/tabs/advertise']);
                    })
                }
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }
}
