import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
    GoogleMaps,
    GoogleMap,
    GoogleMapOptions,
    Environment,
    Geocoder,
    GoogleMapsEvent,
    Marker,
    GoogleMapsAnimation
} from '@ionic-native/google-maps/ngx';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Platform, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import {
    BackgroundGeolocation,
    BackgroundGeolocationConfig,
    BackgroundGeolocationResponse,
    BackgroundGeolocationEvents,
} from '@ionic-native/background-geolocation/ngx';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { BLE } from '@ionic-native/ble/ngx';
import { environment } from 'src/environments/environment';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonService } from '../common.service';
import { formatDate } from '@angular/common';
declare var cordova: any;
declare var window: any;
@Component({
    selector: 'app-mainpage',
    templateUrl: './mainpage.page.html',
    styleUrls: ['./mainpage.page.scss'],
})
export class MainpagePage implements OnInit {
    map: GoogleMap;
    showNavIcon: boolean;
    showBackdrop: boolean;
    apiKey: string;
    address: string;
    totalDist: number;
    datetime: string;
    allPos: any = [];
    bgPos: any = [];
    httpPostPos: any = [];
    curGPS: any = {};
    lastMarker: Marker;
    isBLEConnOnUI: boolean;
    detectBLEDevice: boolean;
    isInDiscover: boolean;
    totalBLEUndetectCnt: number;
    bleDetectIntId: any;
    secondIntId: any;
    gpsDetectIntId: any;
    intervalFlag: boolean;
    gpsAccuracyFlag: boolean;
    runOnForeground: boolean;
    curBleCountdown: number;
    curPosCountdown: number;
    bleDetectTimeout: Boolean;
    secondLastGPSData: any;
    lastGPSData: any;
    hasMission: Boolean;
    netErrorCnt: number;
    earned: number;
    posInit: boolean;
    isSendingData: boolean;
    startFlag: boolean;
    bleIntervalID: any;
    localTotalDist: number;
    lastGpsRecordTs: number;
    gpsRecordID: any;
    mapInitLoader: any;
    curPosSetting: any;
    iosDeviceID: string;
    iosAuthStatus: boolean;
    orderID: number;

    /* Static parameters */
    readonly addrUpdateTimes: number = 5;
    readonly minAcceptAccuracy: number = 32;
    readonly basePrice: number = 1.0;
    readonly maxBLEUndetectCnt: number = 180;
    readonly maxStaticGpsCnt: number = 300;
    readonly maxNetErrorCnt: number = 30;
    readonly bleScanIntvalAfterInit: number = 10;
    readonly bleFirstWarnCnt: number = 60;
    readonly sendHttpInterval: number = 5;
    readonly threePointDetectAngle: number = 40;

    constructor(public alertCtrl: AlertController,
        public platform: Platform,
        public loadCtrl: LoadingController,
        public datePipe: DatePipe,
        public backgroundGeolocation: BackgroundGeolocation,
        public router: Router,
        public bl: BLE,
        public bgMode: BackgroundMode,
        public ble: BluetoothSerial,
        public toastCtrl: ToastController,
        public cd: ChangeDetectorRef,
        public api: ApiService,
        public common: CommonService,
        public geo: Geolocation) {
        this.isBLEConnOnUI = false;
        this.iosDeviceID = '';
        this.iosAuthStatus = true;
        this.initParams();
    }

    initParams(): void {
        this.showNavIcon = true;
        this.showBackdrop = false;
        this.intervalFlag = false;
        this.gpsAccuracyFlag = true;
        this.isInDiscover = false;
        this.totalDist = 0.0;
        this.totalBLEUndetectCnt = 0;
        this.address = '';
        this.curBleCountdown = 0;
        this.curPosCountdown = 0;
        this.netErrorCnt = 0;
        this.runOnForeground = true;
        this.bleDetectTimeout = false;
        this.lastGPSData = null;
        this.secondLastGPSData = null;
        this.bgPos = [];
        this.allPos = [];
        this.hasMission = false;
        this.earned = 0;
        this.posInit = false;
        this.isSendingData = false;
        this.startFlag = false;
        this.lastGpsRecordTs = 0;
        this.orderID = -1;

        if(this.platform.is('ios')) {
            this.curPosSetting = {};
        }else{
            this.curPosSetting = {
                enableHighAccuracy: true, timeout: 10000, maximumAge: 0
            };
        }
    }

    getBleDisconnectMsg(alert, cnt) {
        alert.message = '????????????????????????????????????60????????????????????????????????????????????????<br><br>??????' + (cnt) + '???';
    }

    async ngOnInit() {
        this.bleIntervalID = setInterval(() => {
            //???????????????????????????????????????BLE??????????????????????????????
            if (this.curBleCountdown++ % this.bleScanIntvalAfterInit == 0) {
                this.scanBLEDevice();
            }
        }, 1000);

        this.platform.resume.subscribe(() => {
            this.runOnForeground = true;

            if (!this.showNavIcon) {
                this.addFgEvents();
                this.updateNavRoute();
            }

        });

        //If page is reloaded, stop background geolocation functionality.
        window.onbeforeunload = async () => {
            this.clearAllIntEvents();
            this.backgroundGeolocation.stop();
            clearInterval(this.bleIntervalID);

            try {
                this.bl.stopScan();
            }catch {
            }

            if(this.iosDeviceID.length != 0) {
                try {
                    this.bl.disconnect(this.iosDeviceID);
                }catch {

                }
                this.iosDeviceID = '';
            }
        }
    }

    ionViewWillEnter() {

        if (this.showNavIcon) {
            this.platform.ready().then(() => {
                this.addFgEvents();
                this.preCheck();
            })
        }
    }

    ionViewDidLeave() {
        if (this.showNavIcon) {
            this.clearAllIntEvents();
        }
    }

    async scanBLEDevice() {
        if (this.isInDiscover) {
            return;
        }

        this.isInDiscover = true;
        this.detectBLEDevice = false;

        if(this.platform.is('ios')) {

            if(this.iosDeviceID.length == 0) {
                try {
                    await this.bl.stopScan();
                }catch {

                }
                this.bl.startScan([]).subscribe(async device => {
                    console.log(device)
                    if (!device.name) return;
                    
                    let deviceName: string = device.name;
                    if (deviceName.startsWith(environment.bleNamePrefix)) {
                        this.iosDeviceID = device.id;
                        this.totalBLEUndetectCnt = 0;
                        this.detectBLEDevice = true;
                        this.isBLEConnOnUI = true;
                        this.isInDiscover = false;
                        this.cd.detectChanges();
                        await this.bl.stopScan();
                    }
                })
            }else {
                this.bl.connect(this.iosDeviceID).subscribe(() => {
                    this.bl.readRSSI(this.iosDeviceID).then(data => {
                        if(data > -88) {
                            this.totalBLEUndetectCnt = 0;
                            this.detectBLEDevice = true;
                            this.isBLEConnOnUI = true;
                            this.cd.detectChanges();
                        }

                        this.isInDiscover = false;
                        this.bl.disconnect(this.iosDeviceID);
                    }, () => {
                        this.isInDiscover = false;
                        this.bl.disconnect(this.iosDeviceID);
                    })  
                }, err => {
                    this.isInDiscover = false;
                })
            }         
        }else {
            this.ble.setDeviceDiscoveredListener().subscribe((device: any) => {
                if (!device.name) return;
    
                let deviceName: string = device.name;
                if (deviceName.startsWith(environment.bleNamePrefix)) {
                    this.totalBLEUndetectCnt = 0;
                    this.detectBLEDevice = true;
                    this.isBLEConnOnUI = true;
                    this.cd.detectChanges();
                }
            }, error => {
    
            });
    
            this.ble.discoverUnpaired().then(data => {
                this.isInDiscover = false;
            }, async err => {
                this.reqLocationPermission();
            });
        }
    }

    async reqLocationPermission() {
        await this.common.showDialog('??????', '????????????????????????????????????????????????', async () => {
            this.backgroundGeolocation.getCurrentLocation().then(() => {
                this.addGeoDetector();
            }, err => {
                this.reqLocationPermission();
            });
        });
    }

    async preCheck() {
        this.platform.ready().then(() => {
            this.addGeoDetector();
            this.bgMode.setEnabled(true);
            this.bgMode.disableWebViewOptimizations();

            this.bgMode.on('activate').subscribe(() => {
                this.runOnForeground = false;
                this.addBgEvents();
            });
        })
    }

    async loadMap() {
        Environment.setEnv({
            API_KEY_FOR_BROWSER_RELEASE: this.apiKey
        });

        let mapOptions: GoogleMapOptions = {
            camera: {
                target: this.curGPS,
                zoom: 18,
                tilt: 0,
                bearing: 0
            }
        };

        this.map = GoogleMaps.create('map-canvas', mapOptions);

        this.map.one(GoogleMapsEvent.MAP_READY).then(async () => {

            if(!localStorage.getItem('iosTrack')) {
                const alert = await this.alertCtrl.create({
                    header: '??????',
                    message: '?????????iOS 13??????????????????????????????APP??????????????????????????????????????????????????????????????????????????????: \
                    <br><br>1) ?????????????????????????????????<br>2) ??????10??????????????????<br> \
                    3) ??????????????????????????????????????????????????????[??????????????????]<br>4)?????????APP????????????',
                    backdropDismiss: false,
                    buttons: [
                        {
                            text: '????????????',
                            handler: () => {
                                localStorage.setItem('iosTrack', '1');
                            }
                        }
                    ]
                });
                await alert.present();
            }
            // add a marker
            this.lastMarker = this.map.addMarkerSync({
                title: '????????????',
                position: this.curGPS,
                animation: GoogleMapsAnimation.BOUNCE,
            });

            // show the infoWindow
            this.lastMarker.showInfoWindow();
            await this.mapInitLoader.dismiss();

        }, async () => {
            await this.mapInitLoader.dismiss();
        });

        this.cd.detectChanges();
    }

    async addGeoDetector() {
        this.mapInitLoader = await this.loadCtrl.create({
            message: '???????????????...'
        });

        await this.mapInitLoader.present();

        this.backgroundGeolocation.checkStatus().then(async (result) => {
            if (result.locationServicesEnabled) {
                if (result.authorization) {
                    if (!this.posInit) {
                        this.backgroundGeolocation.getCurrentLocation(this.curPosSetting).then(location => {
                            this.curGPS = { lat: location.latitude, lng: location.longitude, accuracy: location.accuracy };
                            this.loadMap();
                            this.posInit = true;
                        }, async () => {
                            await this.mapInitLoader.dismiss();
                            await this.common.showDialog('??????', '????????????GPS?????????');
                        })
                    } else {
                        await this.mapInitLoader.dismiss();
                    }
                } else {
                    await this.mapInitLoader.dismiss();
                    return;
                }
            } else {
                await this.mapInitLoader.dismiss();
                const alert = await this.alertCtrl.create({
                    header: '??????',
                    message: '??????????????????????????????????????????????????????',
                    backdropDismiss: false,
                    buttons: [
                        {
                            text: '??????',
                            handler: () => {
                                this.backgroundGeolocation.showAppSettings();
                            }
                        }
                    ]
                });
                await alert.present();

                let chkID = setInterval(() => {
                    this.backgroundGeolocation.checkStatus().then((result) => {
                        if (result.locationServicesEnabled) {
                            clearInterval(chkID);
                            this.addGeoDetector();
                        }
                    });
                }, 500);

                return;
            }

            /*
            For version greater than Android 6.0
            Should disable battery optimization for recording GPS and BLE status
            in background mode. Otherwise, it will doze after 5 minutes in background!
            */
            cordova.plugins.backgroundMode.disableBatteryOptimizations();

            const config: BackgroundGeolocationConfig = {
                locationProvider: 0,
                desiredAccuracy: 0,
                stationaryRadius: 1,
                distanceFilter: 5,
                fastestInterval: 1000,
                startForeground: true,
                interval: 1000,
                activitiesInterval: 1000,
                debug: false, //  enable this hear sounds for background-geolocation life-cycle.
                stopOnTerminate: true // enable this to clear background location settings when the app terminates
            };

            this.backgroundGeolocation.on(BackgroundGeolocationEvents.authorization).subscribe(data => {
                let resp: any = data;
                if(resp == 1) {
                    this.iosAuthStatus = true;
                }else {
                    this.iosAuthStatus = false;
                }
            })

            this.backgroundGeolocation.configure(config).then(async () => {
                this.backgroundGeolocation
                    .on(BackgroundGeolocationEvents.location)
                    .subscribe(async (location: BackgroundGeolocationResponse) => {
                        let latitude = Math.round(location.latitude * Math.pow(10, 6)) / Math.pow(10, 6);
                        let longitude = Math.round(location.longitude * Math.pow(10, 6)) / Math.pow(10, 6);
                        let accuracy = Math.round(location.accuracy * Math.pow(10, 2)) / Math.pow(10, 2);
                        let bearing = 0;
                
                        if (location.bearing) {
                            bearing = Math.round(location.bearing * Math.pow(10, 2)) / Math.pow(10, 2);
                        }
                
                        this.curGPS = { lat: latitude, lng: longitude, accuracy: accuracy, bearing: bearing };

                        if (location.accuracy > this.minAcceptAccuracy && !environment.debug) {
                            this.backgroundGeolocation.finish();
                            return;
                        }

                        this.addGPSPosition(location);
                    });
            })

            this.backgroundGeolocation.start();

        });
    }

    addGPSPosition(location) {
        if (this.showNavIcon) {
            if (this.runOnForeground) {
                try {

                    this.lastMarker.setTitle('????????????');
                    this.lastMarker.setPosition(this.curGPS);
                    this.lastMarker.showInfoWindow();

                    this.map.animateCamera({
                        target: this.curGPS,
                        tilt: 0,
                        zoom: 18,
                        duration: 300
                    });
                } catch (e) {
                }
            }
        } else {
            this.curPosCountdown = 0;
            if (this.runOnForeground) {
                this.updateNavRoute();
            } else {
                this.bgPos.push(this.curGPS);
                this.sendData();
            }
        }

        if(this.platform.is('ios')) {
            this.backgroundGeolocation.finish();
        }
    }

    async sendData(isEnd = false) {
        let curData: any = Object.assign({}, this.curGPS);
        curData['record_at'] = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss.s', 'en-US');
        curData['ble_detect'] = this.isBLEConnOnUI ? 1 : 0;
        curData['is_end'] = 0;

        this.httpPostPos.push(curData);

        if (isEnd) {
            this.httpPostPos[this.httpPostPos.length - 1]['is_end'] = 1;
            await this.common.showSpinner(true);
        }

        if (this.isSendingData && !isEnd) return;

        this.httpPostPos = Array.from(new Set(this.httpPostPos));

        if (this.httpPostPos.length >= this.sendHttpInterval || isEnd) {
            this.isSendingData = true;
            await this.markWithAddr();

            if (this.startFlag) {
                this.httpPostPos[0]['start_flag'] = 1;
            }

            let postData = {
                locations: JSON.stringify(this.httpPostPos),
                access_token: localStorage.getItem('access_token')
            };

            if (this.orderID != -1) {
                postData['id'] = this.orderID;
            }

            if (this.httpPostPos.length > 1) {
                this.secondLastGPSData = this.httpPostPos[this.httpPostPos.length - 2];
                this.lastGPSData = this.httpPostPos[this.httpPostPos.length - 1];
            } else {
                this.secondLastGPSData = this.lastGPSData = null;
            }

            this.httpPostPos = [];
            this.api.addNavPositions(postData)
                .subscribe(async (resp: any) => {
                    
                    if (resp.hasOwnProperty('is_end')) {
                        isEnd = resp.is_end;
                    }

                    if(resp.hasOwnProperty('insert_id')) {
                        if(resp.insert_id != -1) {
                            this.orderID = resp.insert_id;
                        }
                    }

                    if (resp.earned) {
                        if (resp.earned > this.earned) {
                            this.earned = resp.earned;
                            this.cd.detectChanges();
                        }
                    }

                    if (this.startFlag) {
                        this.startFlag = false;
                    }

                    this.isSendingData = false;
                    if (isEnd) {

                        this.clearAllIntEvents();
                        await this.common.showSpinner(false);

                        if (resp.status == 10) {
                            let message = '?????????????????????????????????????????????????????????';
                            this.showNavIcon = true;
                            const alert = await this.alertCtrl.create({
                                header: '??????',
                                message: message,
                                backdropDismiss: false,
                                buttons: [
                                    {
                                        text: '??????',
                                        handler: () => {
                                            this.closeBackdrop();
                                        }
                                    }
                                ]
                            });
                            await alert.present();
                            return;
                        }

                        this.showBackdrop = true;
                    } else {
                        if (resp.status != 0) {

                            let message = '';
                            if (resp.status < 0) {
                                message = '????????????????????????????????????';
                            } else if (resp.status == 3) {
                                message = '?????????????????????????????????????????????????????????????????????';
                            } else if (resp.status == 9) {
                                message = '????????????????????????????????????????????????????????????????????????'   
                            } else {
                                message = '???????????????????????????????????????????????????????????????' + (resp.msg ? resp.msg : resp.status);
                            }

                            this.clearAllIntEvents();
                            this.showNavIcon = true;
                            await this.common.showSpinner(false);

                            const alert = await this.alertCtrl.create({
                                header: '??????',
                                message: message,
                                backdropDismiss: false,
                                buttons: [
                                    {
                                        text: '??????',
                                        handler: () => {
                                            this.closeBackdrop();
                                        }
                                    }
                                ]
                            });
                            await alert.present();
                        }
                    }
                }, async err => {
                    this.isSendingData = false;

                    // When Network error reaches limit!
                    if (++this.netErrorCnt > this.maxNetErrorCnt || this.startFlag) {

                        let message = '';

                        if (this.startFlag) {
                            this.startFlag = false;
                            message = '??????????????????????????????????????????';
                        } else {
                            message = '??????????????????' + this.maxNetErrorCnt + '??????????????????????????????';
                        }

                        this.clearAllIntEvents();
                        this.showNavIcon = true;
                        await this.common.showSpinner(false);

                        const alert = await this.alertCtrl.create({
                            header: '??????',
                            message: message,
                            backdropDismiss: false,
                            buttons: [
                                {
                                    text: '??????',
                                    handler: () => {
                                        this.closeBackdrop();
                                    }
                                }
                            ]
                        });
                        await alert.present();
                    }
                });
        }
    }

    async markWithAddr() {
        let tmpGPSData = [];
        let tmpArrOffset = 0;
        let hasRecordAddr = false;

        if (this.secondLastGPSData != null && this.lastGPSData != null) {
            tmpArrOffset = 2;
            tmpGPSData.push(this.secondLastGPSData);
            tmpGPSData.push(this.lastGPSData);
        }

        for (let item of this.httpPostPos) {
            tmpGPSData.push(Object.assign({}, item));
        }

        if (tmpGPSData.length < 3) return;

        for (let i = 0; i < tmpGPSData.length - 2; i++) {
            let angle = this.findAngle(tmpGPSData[i], tmpGPSData[i + 1], tmpGPSData[i + 2]);

            if (isNaN(angle)) continue;

            if ((angle > this.threePointDetectAngle && angle < 180 - this.threePointDetectAngle) || (!hasRecordAddr && i == tmpGPSData.length - 3)) {
                hasRecordAddr = true;
                try {
                    let data: any = await Geocoder.geocode({ position: tmpGPSData[i + 2] });
                    if (data.length > 0) {
                        let geoData = data[0];
                        let address = (geoData.adminArea || '') + (geoData.locality || '') + (geoData.thoroughfare || '');

                        tmpGPSData[i + 2]['address'] = address;
                    }
                } catch {

                }
            }
        }

        for (let i = 0; i < this.httpPostPos.length; i++) {
            let data = Object.assign({}, tmpGPSData[i + tmpArrOffset]);

            if (Object.keys(data).length > 0)
                this.httpPostPos[i] = data;
        }

    }

    findAngle(A, B, C) {
        var AB = Math.sqrt(Math.pow(B.lng - A.lng, 2) + Math.pow(B.lat - A.lat, 2));
        var BC = Math.sqrt(Math.pow(B.lng - C.lng, 2) + Math.pow(B.lat - C.lat, 2));
        var AC = Math.sqrt(Math.pow(C.lng - A.lng, 2) + Math.pow(C.lat - A.lat, 2));

        return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)) * (180 / Math.PI);
    }

    async startNavigate() {
        let hour = new Date().getHours();
        let minute = new Date().getMinutes();
        let allMinute = hour * 60 + minute;

        if (allMinute >= 0 && allMinute < 360) {
            await this.common.showDialog('??????', '??????0-6??????????????????????????????');
            return;
        }

        if(!this.iosAuthStatus) {
            await this.common.showDialog('??????', '????????????????????????????????????????????????????????????????????????????????????????????????', () => {
                this.backgroundGeolocation.showAppSettings();
            });
            return;
        }

        let getData = {
            access_token: localStorage.getItem('access_token')
        };

        await this.common.showSpinner(true);
        this.api.preCheck(getData)
            .subscribe(async (resp: any) => {
                await this.common.showSpinner(false);
                if (resp.status == 0) {
                    let result = resp.result;

                    this.apiKey = result.api_key;
                    if (!result.has_mission) {
                        await this.common.showDialog('??????', '??????????????????????????????????????????');
                        return;
                    }

                    if (result.last_order_record.length != 0) {
                        await this.common.showDialog('??????', '?????????????????????????????????????????????????????????????????????????????????');
                        return;
                    }

                    this.checkBLEDevice();
                }
            }, async err => {
                await this.common.showSpinner(false);
                await this.common.showHttpError(err);
            });
    }

    async checkBLEDevice() {
        const loadCtrl = await this.loadCtrl.create({
            message: '?????????????????????...'
        });

        await loadCtrl.present();

        let localCountDown = 0;
        let localID = setInterval(async () => {

            if (localCountDown >= 10) {
                this.common.showDialog('??????', '???????????????????????????');
                await loadCtrl.dismiss();
                clearInterval(localID);
                return;
            }

            if (this.isBLEConnOnUI) {
                this.curPosCountdown = 0;
                this.totalBLEUndetectCnt = 0;
                this.startMission();
                await loadCtrl.dismiss();
                clearInterval(localID);
                return;

            } else {
                ++localCountDown;
            }
        }, 1000);
    }

    async startMission() {

        const alert = await this.alertCtrl.create({
            header: '??????',
            message: '????????????????????????????????????????????????????????????',
            backdropDismiss: false,
            buttons: [
                {
                    text: '??????'
                }
            ]
        });
        await alert.present();
        this.allPos = [];
        this.startFlag = true;
        this.showNavIcon = false;

        this.backgroundGeolocation.getCurrentLocation(this.curPosSetting).then((location: BackgroundGeolocationResponse) => {
            this.curGPS = {lat: location.latitude, lng: location.longitude, accuracy: location.accuracy};
            this.allPos.push(this.curGPS);

            this.lastMarker.setTitle('????????????');
            this.lastMarker.setPosition(this.curGPS);
            this.lastMarker.showInfoWindow();

            this.map.animateCamera({
                target: this.curGPS,
                tilt: 0,
                zoom: 18,
                duration: 300
            });

            this.updateNavRoute();
        });
    }

    /*
    * ??????????????????
    */
    addBgEvents(): void {

        // ???????????????ID???????????????
        if (this.secondIntId) {
            clearInterval(this.secondIntId);
        }

        this.secondIntId = setInterval(async () => {
            if (!this.detectBLEDevice) {
                ++this.totalBLEUndetectCnt;
            } else {
                this.totalBLEUndetectCnt = 0;
            }

            if (this.totalBLEUndetectCnt > this.maxBLEUndetectCnt) {
                this.clearAllIntEvents();
            }

            ++this.curPosCountdown;
        }, 1000);
    }

    /*
    * ??????????????????
    */
    addFgEvents(): void {

        // ???????????????ID???????????????
        if (this.secondIntId) {
            clearInterval(this.secondIntId);
        }

        this.secondIntId = setInterval(async () => {

            if (!this.detectBLEDevice) {
                ++this.totalBLEUndetectCnt;
            } else {
                this.totalBLEUndetectCnt = 0;
            }

            if (this.totalBLEUndetectCnt == this.bleFirstWarnCnt) {
                this.isBLEConnOnUI = false;
            }

            if (!this.showNavIcon) {
                // ?????????????????????????????????????????????????????????????????????????????????????????????
                if (this.totalBLEUndetectCnt == this.bleFirstWarnCnt) {

                    const alert = await this.alertCtrl.create({
                        header: '??????',
                        backdropDismiss: false,
                        buttons: [
                            {
                                text: '??????',
                            }
                        ]
                    });

                    await alert.present();

                    let localBleCountdown = this.maxBLEUndetectCnt - this.bleFirstWarnCnt;
                    this.getBleDisconnectMsg(alert, localBleCountdown);

                    var bleID = setInterval(async () => {
                        this.getBleDisconnectMsg(alert, --localBleCountdown);

                        if (localBleCountdown <= 0) {
                            clearInterval(bleID);
                        }

                        // ??????????????????????????????????????????????????????
                        if (this.detectBLEDevice) {
                            await alert.dismiss();
                            this.common.showToast('?????????????????????????????????');
                        }

                    }, 1000);

                    alert.onWillDismiss().then(() => {
                        clearInterval(bleID);
                    }, () => {
                        clearInterval(bleID);
                    })
                }

                if (this.totalBLEUndetectCnt > this.maxBLEUndetectCnt) {
                    this.isBLEConnOnUI = false;
                    this.autoEndMission(0);
                }

                if (this.curPosCountdown > this.maxStaticGpsCnt) {
                    this.autoEndMission(1);
                }
            }

            this.cd.detectChanges();
            ++this.curPosCountdown;
        }, 1000);
    }

    async autoEndMission(errorType) {
        let message = '';
        if (errorType == 0) {
            message = '?????? ' + this.maxBLEUndetectCnt + ' ??????????????????????????????????????????????????????';
        } else if (errorType == 1) {
            message = '?????? ' + this.maxStaticGpsCnt + ' ????????????????????????????????????????????????';
        } else if (errorType == 2) {
            message = '?????????????????????GPS???????????????';
        }

        this.clearAllIntEvents();
        const alert = await this.alertCtrl.create({
            header: '??????',
            message: message,
            backdropDismiss: false,
            buttons: [
                {
                    text: '??????',
                    handler: () => {
                        this.showNavIcon = true;
                        this.sendData(true);
                    }
                }
            ]
        });
        await alert.present();
    }

    clearAllIntEvents(): void {

        if (this.secondIntId) {
            clearInterval(this.secondIntId);
        }

        this.backgroundGeolocation.stop();
        this.backgroundGeolocation.removeAllListeners(BackgroundGeolocationEvents.location);
        this.bgMode.setEnabled(false);
        this.bgMode.un('activate', (data) => {
        });
    }

    async updateNavRoute() {

        let polyLineColor: string = '';

        // When app is from background mode to foreground mode
        // There might exist background position arrays
        if (this.bgPos.length > 0) {

            let newPosArray = [];
            if (this.allPos.length > 0) {
                newPosArray = [this.allPos[this.allPos.length - 1]].concat(this.bgPos);
            } else {
                newPosArray = this.bgPos;
            }

            for (let i = 1; i < newPosArray.length; i++) {
                let distTwoPoints = this.getDistanceFromLatLonInKm(
                    newPosArray[i - 1].lat, newPosArray[i - 1].lng, newPosArray[i].lat, newPosArray[i].lng);


                if (newPosArray[i].accuracy > this.minAcceptAccuracy) {
                    polyLineColor = '#dc3545';
                } else {
                    this.totalDist += distTwoPoints;
                    polyLineColor = '#007aff';
                }

                this.map.addPolyline({
                    points: [newPosArray[i - 1], newPosArray[i]],
                    disableAutoPan: false,
                    width: 5,
                    color: polyLineColor
                });

                this.allPos.push(newPosArray[i]);

                if (i == newPosArray.length - 1) {
                    this.lastMarker.setTitle('????????????');
                    this.lastMarker.setPosition(newPosArray[i]);
                    this.lastMarker.showInfoWindow();

                    this.map.animateCamera({
                        target: newPosArray[i],
                        tilt: 0,
                        zoom: 18,
                        duration: 1000,
                        bearing: newPosArray[i].hasOwnProperty('bearing') ? newPosArray[i].bearing : 0
                    });
                }
            }
            this.cd.detectChanges();
            this.bgPos = [];
        }

        if (!this.showNavIcon) {
            this.sendData();
        }

        if (this.allPos.length == 0) {
            this.allPos.push(this.curGPS);
            return;
        }

        if (this.address.length == 0) {
            let data: any = await Geocoder.geocode({ position: this.curGPS });
            if (data.length > 0) {
                let geoData = data[0];
                this.address = (geoData.adminArea || '') + (geoData.locality || '') + (geoData.thoroughfare || '');
            }
        }

        let latestPos: any = this.allPos[this.allPos.length - 1];
        let distTwoPoints = this.getDistanceFromLatLonInKm(latestPos.lat, latestPos.lng, this.curGPS.lat, this.curGPS.lng);

        if (distTwoPoints == 0)
            return;

        this.allPos.push(this.curGPS);

        this.lastMarker.setTitle('????????????');
        this.lastMarker.setPosition(this.curGPS);
        this.lastMarker.showInfoWindow();

        if (this.curGPS.accuracy > this.minAcceptAccuracy) {

            if (this.gpsAccuracyFlag) {
                this.gpsAccuracyFlag = false;
                const toastCtrl = await this.toastCtrl.create({
                    message: 'GPS???????????????????????????????????????',
                    duration: 2500
                })
                await toastCtrl.present();
            }

            polyLineColor = '#dc3545';
        } else {
            if (!this.gpsAccuracyFlag) {
                this.gpsAccuracyFlag = true;
                const toastCtrl = await this.toastCtrl.create({
                    message: 'GPS???????????????????????????????????????',
                    duration: 2500
                })
                await toastCtrl.present();
            }

            this.totalDist += distTwoPoints;
            polyLineColor = '#007aff';
        }

        if (this.allPos.length >= 2) {
            this.map.addPolyline({
                points: [this.allPos[this.allPos.length - 2], this.allPos[this.allPos.length - 1]],
                disableAutoPan: false,
                width: 5,
                color: polyLineColor
            });
        }


        this.map.animateCamera({
            target: this.curGPS,
            zoom: 18,
            tilt: 0,
            duration: 300,
            bearing: this.curGPS.hasOwnProperty('bearing') ? this.curGPS.bearing : 0
        });

        this.cd.detectChanges();
    }

    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;

    }

    deg2rad(deg): number {
        return deg * (Math.PI / 180)
    }

    async stopNavigate() {
        const alert = await this.alertCtrl.create({
            message: '<b>?????????????????????</b>',
            backdropDismiss: false,
            buttons: [
                {
                    text: '??????',
                    role: 'cancel',
                    cssClass: 'primary',
                    handler: () => {
                    }
                }, {
                    text: '??????',
                    handler: async () => {
                        this.clearAllIntEvents();
                        this.showNavIcon = true;
                        this.sendData(true);
                    }
                }
            ]
        });

        await alert.present();
    }

    async closeBackdrop() {
        this.initParams();
        this.posInit = true;
        this.mapInitLoader = await this.loadCtrl.create({
            message: '???????????????...'
        });

        await this.mapInitLoader.present();

        this.map.clear().then(async () => {

            this.map.animateCamera({
                target: this.curGPS,
                zoom: 18,
                tilt: 0,
                duration: 1000,
                bearing: 0
            });

            this.lastMarker = this.map.addMarkerSync({
                title: '????????????',
                position: this.curGPS,
                animation: GoogleMapsAnimation.BOUNCE
            });

            // show the infoWindow
            this.lastMarker.showInfoWindow();
            await this.mapInitLoader.dismiss();
            this.preCheck();
        }, async error => {
            await this.mapInitLoader.dismiss();
        });
    }

    zoomInCurPosition() {
        try {
            this.backgroundGeolocation.getCurrentLocation(this.curPosSetting).then((location: BackgroundGeolocationResponse) => {
                this.curGPS = { lat: location.latitude, lng: location.longitude, accuracy: location.accuracy };
                this.map.animateCamera({
                    target: this.curGPS,
                    zoom: 18,
                    tilt: 0,
                    duration: 1000
                });
                this.lastMarker.setTitle('????????????');
                this.lastMarker.setPosition(this.curGPS);
                this.lastMarker.showInfoWindow();
            })
        } catch (e) {
        }
    }

    getBleColor(): String {
        if (this.isBLEConnOnUI) {
            return 'primary';
        } else {
            return 'light';
        }

    }
}
