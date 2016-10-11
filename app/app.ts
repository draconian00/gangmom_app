/*
  Created by draconian00@gmail.com / 2016.09.25
  로그인 및 인앱브라우저 런치 페이지
*/

import { Component } from '@angular/core';
import { Platform, ionicBootstrap } from 'ionic-angular';
import { StatusBar, InAppBrowser, Device } from 'ionic-native';
import { LoginPage } from './pages/login/login';


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
  public rootPage: any;
  active_status: boolean = true;

  constructor(private platform: Platform) {
    this.rootPage = LoginPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      // notification handler
      var notificationHandler = (notification) => {
        console.log('didReceiveRemoteNotifiactionCallBack: ' + JSON.stringify(notification));
        let jsonData = notification.additionalData;
        if (jsonData.redirect_url) {
          this.active_status = notification.isActive;
          let inapp = InAppBrowser.open(jsonData.redirect_url, '_blank', 'location=no,toolbar=no,zoom=no,hidden=yes');
          inapp.addEventListener('loadstop', () => {
            inapp.show();
          });
          // let open_confirm = confirm('리뷰 수정페이지로 이동하시겠습니까?');
          // if (open_confirm) {
          //   this.active_status = false;
          //   InAppBrowser.open(jsonData.redirect_url, '_blank', 'location=no,toolbar=no,zoom=no');
          // } else {
          //   this.active_status = true;
          // }
        }
      };

      // setting onesignal
      window['plugins'].OneSignal.enableInAppAlertNotification(true);
      window['plugins'].OneSignal.enableSound(true);
      window['plugins'].OneSignal.enableVibrate(true);
      window['plugins'].OneSignal.setSubscription(true);
      window['plugins'].OneSignal.enableInAppAlertNotification(true);
      window['plugins'].OneSignal.enableNotificationsWhenActive(true);

      // onesignal init
      window['plugins'].OneSignal.init(
        '5db18f75-1e72-486d-a0db-82f902784dea', 
        {googleProjectNumber: '600441567099'},
        notificationHandler
      );

      // get onesignal device token then => open inappbrowser 
      window['plugins'].OneSignal.getIds((ids) => {
        // test
        // let url = 'http://localhost:3000/m?device_token=' + ids.userId;
        let url = 'http://gangmom.kr/m?device_token=' + ids.userId;
        if (this.active_status) {
          let inapp = InAppBrowser.open(url, '_blank', 'location=no,toolbar=no,zoom=no,hidden=yes');
          inapp.addEventListener('loadstop', () => {
            inapp.show();
          });
        }
      });
    });
  }
}

ionicBootstrap(MyApp);
