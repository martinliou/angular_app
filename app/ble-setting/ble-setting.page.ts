import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { CommonService, ConstantProvider } from '../common.service';
import { BLE } from '@ionic-native/ble/ngx';
@Component({
    selector: 'app-ble-setting',
    templateUrl: './ble-setting.page.html',
    styleUrls: ['./ble-setting.page.scss'],
})
export class BleSettingPage implements OnInit {

    deviceLists: any = [];
    readonly scanIntval: number = 10000;
    toast: any = null;
    prevToast: any = null;

    constructor(public bl: BLE,
        public platform: Platform,
        public common: CommonService,
        public cd: ChangeDetectorRef,
        public toastCtrl: ToastController) {
    }

    ngOnInit() {
        this.presentUnpairToast();
        this.deviceLists = [];
        this.platform.ready().then(() => {
            this.androidDevBleScan();
        })
    }

    ionViewDidLeave() {
        try {
            this.prevToast.dismiss();
        } catch {
        }

        try {
            this.bl.stopScan();
        }catch {
        }
    }

    async presentUnpairToast() {
        this.prevToast = await this.toastCtrl.create({
            message: '尋找藍芽裝置中...',
        });
        this.prevToast.present();
    }

    async androidDevBleScan() {
        this.deviceLists = [];

        try {
            await this.bl.stopScan();
        }catch {

        }

        this.bl.startScan([]).subscribe(async device => {
            if (!device.name) return;
            
            let deviceName: string = device.name;
            if (deviceName.startsWith(environment.bleNamePrefix)) {
                this.deviceLists.push({
                    name: device.name,
                    connected: true
                })

                try {
                    this.prevToast.dismiss();
                } catch {

                }
                this.toast = await this.toastCtrl.create({
                    message: '藍芽裝置已成功配對！',
                    duration: 500
                })
                this.toast.present();
                this.cd.detectChanges();
                await this.bl.stopScan();
            }
        })
    }

    setupDialog() {
        this.common.showDialog('', ConstantProvider.bleSetup);
    }

    bleDeviceDialog() {
        this.common.showDialog('', ConstantProvider.bleDevice);
    }
}
