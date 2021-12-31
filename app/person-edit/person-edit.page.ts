import { Component, OnInit } from '@angular/core';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { CommonService } from '../common.service';
import { ApiService } from '../api.service';

@Component({
    selector: 'app-person-edit',
    templateUrl: './person-edit.page.html',
    styleUrls: ['./person-edit.page.scss'],
})
export class PersonEditPage implements OnInit {

    phoneNumber: string;
    email: string;
    username: string;
    photo: string;
    tags: string;
    updatePhotoBase64: string;

    constructor(private alertController: AlertController,
        private actionsheetCtrl: ActionSheetController,
        private router: Router,
        private camera: Camera,
        private api: ApiService,
        private common: CommonService) {
        this.updatePhotoBase64 = '';
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.loadData();
    }

    async loadData() {
        let getData = {
            access_token: localStorage.getItem('access_token')
        }

        await this.common.showSpinner(true);
        this.api.getUserInfo(getData)
            .subscribe((resp: any) => {
                this.common.showSpinner(false);
                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                let data = resp.data;
                this.phoneNumber = data.phone_number;
                this.email = data.email;
                this.username = data.username;
                if (data.hasOwnProperty('photo_thumb_url')) {
                    this.photo = data.photo_medium_url + '?time=' + Math.random() * 1000;
                }
                this.tags = data.tags.length != 0 ?
                    Array.from(new Set(data.tags)).join(',') : '無'
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }

    async logout() {
        const alert = await this.alertController.create({
            message: '<b>確定要登出？</b>',
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                    cssClass: 'primary',
                    handler: () => {
                    }
                }, {
                    text: '確定',
                    handler: async () => {
                        let getData = {
                            access_token: localStorage.getItem('access_token')
                        }

                        await this.common.showSpinner(true);
                        this.api.logout(getData)
                            .subscribe((resp: any) => {
                                this.common.showSpinner(false);
                                this.router.navigate(['/login']);
                            });
                    }
                }
            ]
        });

        await alert.present();
    }

    async complete() {

        const formData = new FormData();
        if (this.username) {
            formData.append('username', this.username);

            if (this.username.length > 32) {
                this.common.showDialog('警告', '使用者名稱長度不得超過32個字元！');
                return;
            }
        }

        if (this.email) {
            formData.append('email', this.email);

            if (!this.validateEmail(this.email)) {
                this.common.showDialog('警告', '請填寫合法E-mail！');
                return;
            }
        }

        formData.append('access_token', localStorage.getItem('access_token'));

        if (this.photo.startsWith('data:image')) {
            const byteString = window.atob(this.updatePhotoBase64);
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const int8Array = new Uint8Array(arrayBuffer);

            for (let i = 0; i < byteString.length; i++) {
                int8Array[i] = byteString.charCodeAt(i);
            }

            const blob = new Blob([int8Array], { type: 'image/jpeg' });
            formData.append('avatar_photo', blob, 'avatar.jpg');
        }

        await this.common.showSpinner(true);
        this.api.updateUserData(formData)
            .subscribe(async (resp: any) => {
                this.common.showSpinner(false);

                if (resp.status == -2) {
                    this.common.backToLogin();
                    return;
                }

                if (resp.status == 0) {
                    await this.common.showDialog('成功', '個人資料修改完成', () => {
                        this.router.navigate(['/tabs/setting']);
                    })
                } else {
                    await this.common.showDialog('失敗', '個人資料修改失敗，請聯繫客服處理！', () => {
                        this.router.navigate(['/tabs/setting']);
                    })
                }
            }, async err => {
                this.common.showSpinner(false);
                this.common.showHttpError(err);
            });
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    async changeAvatar() {
        const actionSheet = await this.actionsheetCtrl.create({
            mode: 'ios',
            buttons: [{
                text: '刪除',
                role: 'destructive',
                handler: () => {
                    console.log('Delete clicked');
                }
            }, {
                text: '打開相機',
                handler: () => {
                    const options: CameraOptions = {
                        quality: 100,
                        cameraDirection: this.camera.Direction.FRONT,
                        destinationType: this.camera.DestinationType.DATA_URL,
                        encodingType: this.camera.EncodingType.JPEG,
                        mediaType: this.camera.MediaType.PICTURE
                    };

                    this.camera.getPicture(options).then(async (data) => {
                        await this.common.showSpinner(true);
                        this.updatePhotoBase64 = data;
                        this.photo = 'data:image/jpeg;base64,' + data;
                        await this.common.showSpinner(false);
                    }, async (err) => {
                        await this.common.showDialog('警告', '無法開啟相機！');
                    });
                }
            }, {
                text: '從相簿',
                handler: () => {
                    const options: CameraOptions = {
                        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                        destinationType: this.camera.DestinationType.DATA_URL,
                        encodingType: this.camera.EncodingType.JPEG,
                        mediaType: this.camera.MediaType.PICTURE
                    };

                    this.camera.getPicture(options).then((data) => {
                        this.updatePhotoBase64 = data;
                        this.photo = 'data:image/jpeg;base64,' + data;
                    }, async (err) => {
                        await this.common.showDialog('警告', '無法取得相片！');
                    });
                }
            }, {
                text: '取消',
                role: 'cancel',
                handler: () => {
                }
            }]
        });
        await actionSheet.present();
    }
}
