import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';

// services
import { AuthService } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  login: {email?: string, password?: string} = {};
  submitted = false;

  constructor(
    public alertController: AlertController,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public auth: AuthService) {
  }

  ionViewDidLoad() {
  }

  onLogin(form) {
    console.log(form);
    this.submitted = true;
    if (form.valid) {
      this.auth.LoadingControllerShow();
      this.auth.signInWithEmail(this.login)
      .then(() => {
          this.LoginSuccess();
        }
      )
      .catch(
        (error) => {
          this.auth.LoadingControllerDismiss();
          this.LoginError(error);
        }
      );
    }
  }
  

  LoginSuccess() {
    setTimeout(() => {
      this.navCtrl.setRoot(HomePage, {}, {animate: true, direction: 'forward'});
    }, 1000);
  }

  LoginError(error) {
    let alert = this.alertController.create({
      title: 'Login Failed',
      subTitle: 'Please check your email and/or password and try again',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            //do handler stuff here
          }
        }
      ]
    });
    alert.present();
  }

  showPassword(input: any): any {
    input.type = input.type === 'password' ?  'text' : 'password';
  }

  loginUser() {
    this.navCtrl.setRoot(HomePage);
  }

  forgetPassword() {
    this.navCtrl.setRoot(SignupPage);
  }

  signUp() {
    this.navCtrl.push(SignupPage);
  }
}
