/*
  Created by draconian00@gmail.com / 2016.09.25
  로그인 및 인앱브라우저 런치 페이지
*/

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { InAppBrowser, Device, SQLite, Toast} from 'ionic-native';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

// declare var FCMplugin: any;

@Component({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {

  public db: SQLite;
  email: string;
  password: string;
  os: any;
  deviceToken: any;

  constructor(public navCtrl: NavController, private http: Http) {
    setTimeout(() => {
      this.os = Device.device.platform;
      console.log(this.os);

      this.db = new SQLite();
      console.log(this.db);

      this.db.openDatabase({
        name: 'gangmom.db',
        location: 'default'
      }).then(() => {
        this.db.executeSql('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, deviceToken TEXT)', {}).then(
          (data) => {
            console.log('Table Created.', data);
            this.selectUser();
          }, (err) => {
            console.log(err);
          });
      });
    }, 10);
  }

  selectUser() {
    this.db.executeSql('SELECT * FROM user ORDER BY id DESC LIMIT 1', []).then(
      (data) => {
        if (data.rows.length > 0) {
          console.log(data.rows.item(0));
          this.email = data.rows.item(0).email;
          this.password = data.rows.item(0).password;
          
          this.submit();
          Toast.show(this.email + '\r\n아이디로 로그인 되었습니다.', '3000', 'bottom').subscribe(
            toast => {
              console.log('TOAST' + toast);
            }
          );
        }
      }, (err) => {
        console.log(err);
      }
    );
  }

  localUserCheck() {
    this.db = new SQLite();
    this.db.openDatabase({
      name: 'gangmom.db',
      location: 'default'
    }).then(() => {
      this.db.executeSql('SELECT * FROM user WHERE email = "' + this.email + '"', []).then(
        (data) => {
          if (data.rows.length > 0) {
            this.updateUser();
          } else {
            this.insertUser();
          }
        }, (err) => {
          console.log(err);
        }
      );
    }, (err) => {
      console.log('DB open ERROR', err);
    });
  }

  insertUser() {
    this.db.executeSql('INSERT INTO user (email, password, deviceToken) VALUES ("' + this.email + '", "' + this.password + '", "' + this.deviceToken + '")', []).then(
      () => console.log('INSERT success', this.email, this.password, this.deviceToken),
      (err) => console.error('INSERT ERROR', err)
    );
  }

  updateUser() {
    this.db.executeSql('UPDATE user SET email = "' + this.email + '", password = "' + this.password + '", deviceToken = "" WHERE email = "' + this.deviceToken + '"', []).then(
      () => console.log('UPDATE success', this.email, this.password, this.deviceToken),
      (err) => console.error(err)
    );
  }

  submit() {
    window['plugins'].OneSignal.getIds((ids) => {
      this.deviceToken = ids.userId;
      // console.log(this.deviceToken);
      let data = {
        'email': this.email,
        'password': this.password,
        'deviceToken': this.deviceToken
      };
      // console.log(data);
      this.check(data)
          .then(res => {
            // User confirm by Check api
            if (res.result) {
              console.log(res.result);
              this.localUserCheck();
              // open rails page with InAppBrowser.
              let url = 'http://gangmom.kr/ionic_login?email=' + this.email + '&password=' + this.password;
              // let url = 'http://localhost:3000/ionic_login?email=' + this.email + '&password=' + this.password;
              // if (this.os === 'Android') {
              //   url = 'http://10.0.2.2:3000/ionic_login?email=' + this.email + '&password=' + this.password;
              // }

              // launch InAppBrowser
              InAppBrowser.open(url, '_blank', 'location=no,toolbar=no,zoom=no,clearcache=yes,clearsessioncache=yes');
            } else {
              Toast.show('로그인을 실패했습니다.\r\n이메일과 비밀번호를 다시 확인해주세요.', '3000', 'bottom').subscribe(
                toast => {
                  console.log('TOAST' + toast);
                }
              );
            }
          });
    });
  }

  signup() {
    let url = 'http://gangmom.kr/join_0_m';
    InAppBrowser.open(url, '_blank', 'location=no,toolbar=no,zoom=no,clearcache=yes,clearsessioncache=yes');
  }

  check(data) {
    // access to rails api
    // production
    let url = 'http://gangmom.kr/ionic_check';
    // let url = 'http://localhost:3000/ionic_check';
    // if (this.os === 'Android') {
    //   url = 'http://10.0.2.2:3000/ionic_check';
    // }

    let body = JSON.stringify(data);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    // POST REQUEST
    return this.http.post(url, body, options)
               .toPromise()
               .then(response => response.json());
  }

  enter(event) {
    if (event.keyCode === 13) {
      this.submit();
    }
  }
}
