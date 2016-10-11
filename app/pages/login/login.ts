/*
  Created by draconian00@gmail.com / 2016.09.25
  로그인 및 인앱브라우저 런치 페이지
*/

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

// declare var FCMplugin: any;

@Component({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {
  deviceToken: any;

  constructor(public navCtrl: NavController, private http: Http) {
    setTimeout(() => {
      window['plugins'].OneSignal.getIds((ids) => {
        this.deviceToken = ids.userId;
      });
    }, 10);

    // app.ts 에서  InAppBrowser를 못 열었을때 login.html 에서 InAppBrowser를 열 수 있는 버튼 소환
    setTimeout(() => {
      document.getElementById('spinner').className = 'loadingSpinner hide';
      document.getElementById('refresh_div').className = '';
    }, 10000);
  }

  // launch InAppBrowser
  openBrowser() {
    // test
    // let url = 'http://localhost:3000/m?device_token=' + this.deviceToken;
    let url = 'http://gangmom.kr/m?device_token=' + this.deviceToken;
    InAppBrowser.open(url, '_blank', 'location=no,toolbar=no,zoom=no');
  }
}
