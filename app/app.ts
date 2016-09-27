/*
  Created by draconian00@gmail.com / 2016.09.25
  로그인 및 인앱브라우저 런치 페이지
*/

import { Component } from '@angular/core';
import { Platform, ionicBootstrap } from 'ionic-angular';
import { StatusBar, SQLite } from 'ionic-native';
import { LoginPage } from './pages/login/login';


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
  public rootPage: any;

  constructor(private platform: Platform) {
    this.rootPage = LoginPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      var notificationHandler = function(notification) {
        console.log('didReceiveRemoteNotifiactionCallBack: ' + JSON.stringify(notification));
        let jsonData = notification.additionalData;
        if (jsonData.title === 'SYSTEM' && jsonData.autoLogin === 'disabled') {
          let db = new SQLite();
          db.openDatabase({
            name: 'gangmom.db',
            location: 'default'
          }).then(() => {
            db.executeSql('DELETE FROM user', []).then(
              () => console.log('DELETE success'),
              (err) => console.error('DELETE ERROR', err)
            );
          });
        }
      };

      window['plugins'].OneSignal.enableInAppAlertNotification(true);
      window['plugins'].OneSignal.enableSound(true);
      window['plugins'].OneSignal.enableVibrate(true);
      window['plugins'].OneSignal.setSubscription(true);
      window['plugins'].OneSignal.enableInAppAlertNotification(true);
      window['plugins'].OneSignal.enableNotificationsWhenActive(true);

      window['plugins'].OneSignal.init(
        '5db18f75-1e72-486d-a0db-82f902784dea', 
        {googleProjectNumber: '600441567099'},
        notificationHandler
      );
    });
  }
}

ionicBootstrap(MyApp);
