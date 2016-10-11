/*
  Created by draconian00@gmail.com / 2016.09.25
  로그인 및 인앱브라우저 런치 페이지
*/

import { Component } from '@angular/core';
import { Platform, NavController, AlertController } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

// declare var FCMplugin: any;

@Component({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {
  deviceToken: any;
  active_status: boolean = true;

  constructor(public navCtrl: NavController, private http: Http, private platform: Platform, private alertCtrl: AlertController) {
    // InAppBrowser를 못 열었을때 login.html 에서 InAppBrowser를 열 수 있는 버튼 소환
    setTimeout(() => {
      this.loadingComment_hide();
      this.refreshComment_show();
    }, 10000);

    platform.ready().then(() => {
      // notification handler
      var notificationHandler = (notification) => {
        console.log('didReceiveRemoteNotifiactionCallBack: ' + JSON.stringify(notification));
        let jsonData = notification.additionalData;
        if (jsonData.redirect_url) {
          this.refreshComment_hide();
          this.loadingComment_show();
          this.active_status = notification.isActive;

          let inapp = InAppBrowser.open(jsonData.redirect_url, '_blank', 'location=no,toolbar=no,zoom=no,hidden=yes');
          inapp.addEventListener('loadstop', () => {
            inapp.show();
            this.loadingComment_hide();
            this.refreshComment_show(); 
          });
        }
      };

      // onesignal init
      window['plugins'].OneSignal.init(
        '5db18f75-1e72-486d-a0db-82f902784dea', 
        {googleProjectNumber: '600441567099'},
        notificationHandler
      );

      // setting onesignal
      window['plugins'].OneSignal.enableSound(true);
      window['plugins'].OneSignal.enableVibrate(true);
      window['plugins'].OneSignal.setSubscription(true);
      window['plugins'].OneSignal.enableInAppAlertNotification(true);
      window['plugins'].OneSignal.enableNotificationsWhenActive(true);

      // get onesignal device token then => open inappbrowser 
      window['plugins'].OneSignal.getIds((ids) => {
        this.deviceToken = ids.userId;
        let url = 'http://gangmom.kr/m?device_token=' + this.deviceToken;
        if (this.active_status) {
          let inapp = InAppBrowser.open(url, '_blank', 'location=no,toolbar=no,zoom=no,hidden=yes');
          inapp.addEventListener('loadstop', () => {
            inapp.show();
          });
        }
      });
    });
  }

  // launch InAppBrowser
  openBrowser() {
    let url = 'http://gangmom.kr/m?device_token=' + this.deviceToken;
    InAppBrowser.open(url, '_blank', 'location=no,toolbar=no,zoom=no');
  }

  loadingComment_show() {
    document.getElementById('spinner').className = 'loadingSpinner';
    document.getElementById('loading_comment').className = '';
  }
  loadingComment_hide() {
    document.getElementById('spinner').className = 'loadingSpinner hide';
    document.getElementById('loading_comment').className = 'hide';
  }
  refreshComment_show() {
    document.getElementById('refresh_comment').className = '';
    document.getElementById('refresh_btn').className = 'button button-default';
  }
  refreshComment_hide() {
    document.getElementById('refresh_comment').className = 'hide';
    document.getElementById('refresh_btn').className = 'hide';
  }
}
