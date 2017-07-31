import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

// Services
import { AuthService } from '../../providers/auth-service/auth-service';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  signup: {fullname?: string, email?: string, password?: string} = {};
  submitted = false;
  alertMessage: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertController: AlertController,
    public auth: AuthService) {
  }


  onSignup(form) {
    this.submitted = true;
    if (form.valid) {      
      this.auth.LoadingControllerShow();
      this.auth.signUpWithEmail(this.signup).then(() => {
          this.SignupSuccess();
        }).catch(
        (error) => {
          this.auth.LoadingControllerDismiss();
          this.SignUpError(error);
        }
      );
    }
  }


  SignupSuccess() {
    setTimeout(() => {
        this.navCtrl.setRoot(HomePage, {}, {animate: true, direction: 'forward'});
      }, 1000);    
  }
  
  SignUpError(error): void {
    switch (error.code) {
      case "auth/email-already-in-use":
          this.alertMessage = "The specified email is already in use!"
          break;
      case "auth/invalid-email":
          this.alertMessage = "The specified email is not valid!"
          break;
      case "auth/operation-not-allowed":
          this.alertMessage = "Your account has been disabled. Please contact support!"
          break;
      case "auth/weak-password":
          this.alertMessage = "Password should be at least 6 characters!"
          break;
    }
    let alert = this.alertController.create({
      title: 'Sign Up Failed',
      subTitle: this.alertMessage,
      buttons: ['Ok']
    });
    alert.present();
  }

}
