import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    readonly domain: string = 'https://api_dev.lichenads.com/';

    constructor(private http: HttpClient) { }

    public getUserBalance(access_token) {
        return this.http.get(this.domain + 'transaction/get_user_balance?access_token=' + access_token);
    }

    public addUserWithdraw(postData) {
        let post = this.composeFormData(postData);
        return this.http.post(this.domain + 'transaction/add_user_withdraw', post);
    }

    public getCountyList() {
        return this.http.get(this.domain + 'geo/get_counties');
    }

    public getDistrictList(district_id) {
        return this.http.get(this.domain + 'geo/get_districts?county_id=' + district_id);
    }

    public getBankList() {
        return this.http.get(this.domain + 'transaction/get_all_banks');
    }

    public getBranchList(bank_id) {
        return this.http.get(this.domain + 'transaction/get_all_branches?bank_id=' + bank_id);
    }

    public addBankAccount(data) {
        let post = this.composeFormData(data);
        return this.http.post(this.domain + 'transaction/add_user_bank', post);
    }

    public editBankAccount(data) {
        let post = this.composeFormData(data);
        return this.http.post(this.domain + 'transaction/edit_user_bank', post);
    }

    public getTransaction(data) {
        let url = this.domain + 'transaction/get_user_transactions?access_token=' + data.access_token;

        let optionalFields = ['type', 'started_at', 'ended_at'];
        for (let item of optionalFields) {
            if (data.hasOwnProperty(item)) {
                url += '&' + item + '=' + data[item];
            }
        }

        return this.http.get(url);
    }

    public getHistoryOrder(data) {
        let url = this.domain + 'transaction/get_history_orders?access_token=' + data.access_token;

        let optionalFields = ['id'];
        for (let item of optionalFields) {
            if (data.hasOwnProperty(item)) {
                url += '&' + item + '=' + data[item];
            }
        }

        return this.http.get(url);
    }

    public getAdvertise(data) {
        let url = this.domain + 'advertise/get_advertise?access_token=' + data.access_token;

        let optionalFields = ['id'];
        for (let item of optionalFields) {
            if (data.hasOwnProperty(item)) {
                url += '&' + item + '=' + data[item];
            }
        }

        return this.http.get(url);
    }

    public getAdvLocations() {
        let url = this.domain + 'advertise/get_install_location';
        return this.http.get(url);
    }

    public addMission(data) {
        let post = this.composeFormData(data);
        return this.http.post(this.domain + 'advertise/add_user_advertise', post);
    }

    public getMissions(data) {
        let url = this.domain + 'advertise/get_user_advertise?access_token=' + data.access_token;

        return this.http.get(url);
    }

    public verifyMissionCode(data) {
        let post = this.composeFormData(data);
        return this.http.post(this.domain + 'advertise/verify_mission_code', post);
    }

    public getPersonInfo(data) {
        let url = this.domain + 'system/get_personal_message?access_token=' + data.access_token;

        let optionalFields = ['id'];
        for (let item of optionalFields) {
            if (data.hasOwnProperty(item)) {
                url += '&' + item + '=' + data[item];
            }
        }

        return this.http.get(url);
    }


    public getSysAnno(data) {
        let url = this.domain + 'system/get_system_announce?';

        return this.http.get(url);
    }

    public getUserInfo(data) {
        let url = this.domain + 'user/get_user_data?access_token=' + data.access_token;
        return this.http.get(url);
    }

    public getWalletUpdate(data) {
        let url = this.domain + 'system/get_user_wallet_update?access_token=' + data.access_token;

        return this.http.get(url);
    }

    public updateUserData(data) {
        return this.http.post(this.domain + 'user/edit_user_data', data);
    }

    public getPrivacySetting(data) {
        let url = this.domain + 'system/get_privacy?access_token=' + data.access_token;
        return this.http.get(url);
    }

    public setPrivacySetting(data) {
        let post = this.composeFormData(data);
        return this.http.post(this.domain + 'system/update_privacy', post);
    }

    public login(data) {
        let post = this.composeFormData(data);
        return this.http.post(this.domain + 'user/login', post);
    }

    public logout(data) {
        let post = this.composeFormData(data);
        return this.http.post(this.domain + 'user/logout', post);
    }

    public getDrivePrefs() {
        let url = this.domain + 'advertise/get_drive_preference';
        return this.http.get(url);
    }

    public updateUserDrivePref(data) {
        let post = this.composeFormData(data);
        return this.http.post(this.domain + 'advertise/update_user_drive_preference', post);
    }

    public deleteAccount(data) {
        let post = this.composeFormData(data);
        return this.http.post(this.domain + 'user/delete_user_data', post);
    }

    public updatePhoneNumber(data) {
        let post = this.composeFormData(data);
        return this.http.post(this.domain + 'user/update_phone_number', post);
    }

    public uploadMissionPhoto(data) {
        return this.http.post(this.domain + 'advertise/upload_mission_photo', data);
    }

    public getGoogleMapApiKey() {
        let url = this.domain + 'setting/get_google_api_key';
        return this.http.get(url);
    }

    public addNavPositions(data) {
        let post = this.composeFormData(data);
        return this.http.post(this.domain + 'advertise/add_nav_positions', post);
    }

    public preCheck(data) {
        let url = this.domain + 'system/get_precheck?access_token=' + data.access_token;
        return this.http.get(url);
    }
    private composeFormData(data) {
        const formData = new FormData();
        let obj: any;

        if (Object.keys(data).length != 0) {
            for (obj in data) {
                formData.append(obj, data[obj]);
            }
        }

        return formData;
    }
}
